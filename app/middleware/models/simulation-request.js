module.exports = class SimulationRequest {
    constructor(maxRandomDelay, labels, setUserContext, setCustomContext) {
        this.maxRandomDelay = maxRandomDelay;
        this.labels = labels;
        this.setUserContext = setUserContext;
        this.setCustomContext = setCustomContext;
    }
}