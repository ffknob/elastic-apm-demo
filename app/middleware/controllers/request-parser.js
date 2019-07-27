const SimulationRequest = require('../models/simulation-request');

exports.requestParser = (req, res, next) => {
    const simulationOptions = req.body.simulationOptions;

    const simulationRequest = new SimulationRequest(
        simulationOptions.maxRandomDelay,
        simulationOptions.labels,
        simulationOptions.setUserContext,
        simulationOptions.setCustomContext);

    res.locals.simulationRequest = simulationRequest;
    next();
};