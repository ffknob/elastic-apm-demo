const SimulationService = require('../services/simulation');
const SimulationRequest = require('../models/simulation-request');

exports.generateSuccess = async (req, res, next) => {
    const simulationRequest = req.locals.simulationRequest;

    await SimulationService.generateSuccess(simulationRequest);

    res.send('done');
};

exports.generateThrowError = async (req, res, next) => {
    const simulationRequest = req.locals.simulationRequest;

    try {
        await SimulationService.generateThrowError(simulationRequest);
    } catch(err) {
        res.status(500).send('Internal Server Error');
    }
};

exports.generateException = async (req, res, next) => {
    const simulationRequest = req.locals.simulationRequest;

    await SimulationService.generateException(simulationRequest);
};