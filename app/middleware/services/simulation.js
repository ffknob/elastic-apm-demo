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

    async init(simulationRequest) {
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

        await delayGenerator.randomDelay(simulationRequest.maxRandomDelay);
    }

    async generateSuccess(simulationRequest) {
        await this.init(simulationRequest);
    }

    async generateThrownError(simulationRequest) {
        await this.init(simulationRequest);

        const errorGenerator = new ErrorGenerator();
        throw errorGenerator.getRandomError(); 
    }

    async generateUncaughtError(simulationRequest) {
        const apmService = new ApmService();
        
        await this.init(simulationRequest);

        const errorGenerator = new ErrorGenerator();

        apmService.captureError(errorGenerator.getRandomError()); 
    }

    async generateComplexTransaction(simulationRequest) {
        const apmService = new ApmService();
        const delayGenerator = new DelayGenerator();

        await this.init(simulationRequest);

        for(let i = 0; i < simulationRequest.complexTransactionTotalSpans; i++) {
            let randomSpanTypeIndex = util.randomNumber(apmService.SPAN_TYPES().length);
            let span = apmService.startSpan(`Span #${i}`, apmService.SPAN_TYPES()[randomSpanTypeIndex]);

            await delayGenerator.randomDelay(simulationRequest.maxRandomDelay);

            span.end();

            await delayGenerator.randomDelay(simulationRequest.maxRandomDelay);
        }
    }
}