const DelayGenerator = require('./delay-generator');
const ErrorGenerator = require('./error-generator');
const ApmService = require('./apm');
const util = require('../shared/util');

module.exports = class Simulation {
    constructor() { }

    createUserContext(simulationRequest) {
        return {
            random: simulationRequest.setRandomUserContext,
            id: simulationRequest.userContext.id,
            username: simulationRequest.userContext.username,
            email: simulationRequest.userContext.email
        };
    }

    async init(simulationRequest) {
        const apmService = new ApmService();
        const delayGenerator = new DelayGenerator();

        const userContext = this.createUserContext(simulationRequest);
        apmService.setUserContext(userContext);

        await delayGenerator.randomDelay(simulationRequest.maxRandomDelay);
    }

    async generateSuccess(simulationRequest) {
        this.init(simulationRequest);
    }

    async generateThrownError(simulationRequest) {
        this.init(simulationRequest);

        const errorGenerator = new ErrorGenerator();
        throw errorGenerator.getRandomError(); 
    }

    async generateUncaughtError(simulationRequest) {
        const apmService = new ApmService();
        
        this.init(simulationRequest);

        const errorGenerator = new ErrorGenerator();

        apmService.captureError(errorGenerator.getRandomError()); 
    }

    async generateComplexTransaction(simulationRequest) {
        const apmService = new ApmService();
        const delayGenerator = new DelayGenerator();

        this.init(simulationRequest);

        for(let i = 0; i < simulationRequest.complexTransactionTotalSpans; i++) {
            let randomSpanTypeIndex = util.randomNumber(apmService.SPAN_TYPES().length);
            let span = apmService.startSpan(`Span #${i}`, apmService.SPAN_TYPES()[randomSpanTypeIndex]);

            await delayGenerator.randomDelay(simulationRequest.maxRandomDelay);

            span.end();

            await delayGenerator.randomDelay(simulationRequest.maxRandomDelay);
        }
    }
}