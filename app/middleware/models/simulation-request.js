module.exports = class SimulationRequest {
    constructor(maxRandomDelay, labels) {
        this.maxRandomDelay = maxRandomDelay;
        this.labels = labels;
    }
}