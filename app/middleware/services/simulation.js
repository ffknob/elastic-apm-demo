const axios = require('axios');

const uuid = require('uuid');
const DelayGenerator = require('./delay-generator');
const ErrorGenerator = require('./error-generator');
const LabelGenerator = require('./label-generator');
const ApmService = require('./apm');
const util = require('../shared/util');

module.exports = class Simulation {
    constructor() { }

    createUserContext(simulationRequest) {
        const userContext = simulationRequest.userContext;

        if (userContext) {
            return {
                random: simulationRequest.setRandomUserContext,
                id: userContext.id,
                username: userContext.username,
                email: userContext.email
            };
        } else {
            return { random: true };
        }
    }

    async init(simulationRequest, delayOnInit) {
        const apmService = new ApmService();
        const delayGenerator = new DelayGenerator();

        const userContext = this.createUserContext(simulationRequest);
        apmService.setUserContext(userContext);

        if (simulationRequest.setRandomLabels) {
            const labelGenerator = new LabelGenerator();
            const label = labelGenerator.getRandomLabel();
            apmService.setLabel(label.name, label.value);
        } else {
            simulationRequest.labels.forEach(label => apmService.setLabel(label.name, label.value));
        }

        if (delayOnInit) {
            await delayGenerator
            .randomDelay(simulationRequest.maxRandomDelay)
            .then(delay => apmService.setLabel('random-delay', delay));
        }
    }

    async generateSuccess(simulationRequest) {
        await this.init(simulationRequest, true);
    }

    async generateThrownError(simulationRequest) {
        await this.init(simulationRequest, true);

        const errorGenerator = new ErrorGenerator();
        throw errorGenerator.getRandomError();
    }

    async generateCapturedError(simulationRequest) {
        const apmService = new ApmService();
        
        await this.init(simulationRequest, true);

        const errorGenerator = new ErrorGenerator();
        const error = errorGenerator.getRandomError();

        apmService.captureError(
            error,
            { 
                handled: false,
                custom: { 
                    fake: true,
                    category: error.category,
                    statusCode: errorGenerator.statusCode
                }
            }
        );
    }

    async generateComplexTransaction(simulationRequest) {
        const apmService = new ApmService();
        const delayGenerator = new DelayGenerator();

        const complexTransaction = simulationRequest.complexTransaction;
        const traceparent = apmService.getCurrentTraceparent();

        await this.init(simulationRequest, false);

        for (let i =0; i < complexTransaction.totalSubTransactions; i++) {
            let subTransactionName = `Sub-transaction #${i}`;
            let subTransactionType = 'custom';
            let subTransactionId = uuid.v4().split('-')[0];
            let subTransaction = 
                apmService.startTransaction(
                    `${subTransactionName} (${subTransactionId})`,
                    subTransactionType,
                    { childOf:  traceparent});

            for (let j = 0; j < complexTransaction.totalSpans; j++) {
                let randomSpanTypeIndex = util.randomNumber(apmService.SPAN_TYPES().length);
                let span = subTransaction.startSpan(`Span #${i}.${j}`, apmService.SPAN_TYPES()[randomSpanTypeIndex]);
    
                await delayGenerator.randomDelay(simulationRequest.maxRandomDelay);
    
                span.end();
    
                await delayGenerator.randomDelay(simulationRequest.maxRandomDelay);
            }

            subTransaction.end();
        }
    }

    async generateDistributedTransaction(simulationRequest) {
        const datasets = ['users', 'todos', 'comments', 'albuns', 'photos'];
        const randomIndex = Math.floor(Math.random() * (datasets.length));
        const fetchAndSaveEndpoint = `http://external-service:3000/api/${datasets[randomIndex]}/fetch`;

        await this.init(simulationRequest, false);

        return await axios.get(fetchAndSaveEndpoint);
    }
}