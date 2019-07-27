const SimulationRequest = require('../models/simulation-request');

exports.requestParser = async (req, res, next) => {
    const maxRandomDelay = req.body.maxRandomDelay;
    const labels = req.body.labels;
    const simulationRequest = new SimulationRequest(maxRandomDelay, labels);

    req.locals.simulationRequest = simulationRequest;
    res.next();
};