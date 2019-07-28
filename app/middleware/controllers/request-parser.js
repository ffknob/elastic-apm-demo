const SimulationRequest = require('../models/simulation-request');

exports.requestParser = (req, res, next) => {
    const simulationSettings = req.body.simulationSettings;

    const simulationRequest = new SimulationRequest(
        simulationSettings.maxRandomDelay,
        simulationSettings.labels,
        simulationSettings.setRandomUserContext,
        simulationSettings.setRandomCustomContext,
        simulationSettings.userContext,
        simulationSettings.customContext);

    res.locals.simulationRequest = simulationRequest;
    next();
};