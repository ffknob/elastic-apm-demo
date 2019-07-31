const uuid = require('uuid');
const DelayGenerator = require('./delay-generator');
const ErrorGenerator = require('./error-generator');
const ApmService = require('./apm');
const util = require('../shared/util');

module.exports = class BackgroundTask {
    constructor() { }

    async execute(transactionName, transactionType, totalSpans, maxRandomDelay, userContext) {
        const apmService = new ApmService();
        const delayGenerator = new DelayGenerator();

        const transactionId = uuid.v4().split('-')[0];
        const transaction = apmService.startTransaction(`${transactionName} (${transactionId})`, transactionType);

        apmService.setUserContext(userContext);

        for(let i = 0; i < totalSpans; i++) {
            let randomSpanTypeIndex = util.randomNumber(apmService.SPAN_TYPES().length);
            let span = apmService.startSpan(`Span #${i}`, apmService.SPAN_TYPES()[randomSpanTypeIndex]);

            await delayGenerator.randomDelay(maxRandomDelay);

            span.end();

            await delayGenerator.randomDelay(maxRandomDelay);
        }

        transaction.end();
    }
}