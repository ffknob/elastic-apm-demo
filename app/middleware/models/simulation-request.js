module.exports = class SimulationRequest {
    constructor(maxRandomDelay,
                setRandomUserContext,
                userContext,
                setRandomCustomContext,
                customContext,
                setRandomLabels,
                labels,
                complexTransaction,
                distributedTransaction) {
        this.maxRandomDelay = maxRandomDelay;
        this.setRandomUserContext = setRandomUserContext;
        this.userContext = userContext;
        this.setRandomCustomContext = setRandomCustomContext;
        this.customContext = customContext;
        this.setRandomLabels = setRandomLabels;
        this.labels = labels;
        this.complexTransaction = complexTransaction;
        this.distributedTransaction = distributedTransaction;
    }
}