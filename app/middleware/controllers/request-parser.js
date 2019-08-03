const SimulationRequest = require('../models/simulation-request');

exports.requestParser = (req, res, next) => {
    const simulationSettings = req.body.simulationSettings;

    const simulationRequest = new SimulationRequest(
        simulationSettings.maxRandomDelay,
        simulationSettings.setRandomUserContext,
        simulationSettings.userContext,
        simulationSettings.setRandomCustomContext,        
        simulationSettings.customContext,
        simulationSettings.setRandomLabels,        
        simulationSettings.labels,        
        simulationSettings.complexTransaction);
console.log(simulationRequest);
    res.locals.simulationRequest = simulationRequest;
    next();
};
