module.exports = class SimulationRequest {
    constructor(maxRandomDelay,
                labels,
                setRandomUserContext,
                setRandomCustomContext,
                userContext,
                customContext) {
        this.maxRandomDelay = maxRandomDelay;
        this.labels = labels;
        this.setRandomUserContext = setRandomUserContext;
        this.setRandomCustomContext = setRandomCustomContext;
        this.userContext = userContext;
        this.customContext = customContext;
    }
}