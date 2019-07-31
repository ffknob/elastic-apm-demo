module.exports = class SimulationRequest {
    constructor(maxRandomDelay,
                labels,
                setRandomUserContext,
                setRandomCustomContext,
                userContext,
                customContext,
                complexTransactionTotalSpans) {
        this.maxRandomDelay = maxRandomDelay;
        this.labels = labels;
        this.setRandomUserContext = setRandomUserContext;
        this.setRandomCustomContext = setRandomCustomContext;
        this.userContext = userContext;
        this.customContext = customContext;
        this.complexTransactionTotalSpans = complexTransactionTotalSpans;
    }
}