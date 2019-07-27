const SimulationService = require('../services/simulation');
const SimulationRequest = require('../models/simulation-request');

exports.generateSuccess = async (req, res, next) => {
    const simulationRequest = res.locals.simulationRequest;

    await SimulationService.generateSuccess(simulationRequest);

    res.send('done');
};

exports.generateThrownError = async (req, res, next) => {
    const simulationRequest = res.locals.simulationRequest;

    try {
        await SimulationService.generateThrownError(simulationRequest);
    } catch(err) {
        res.status(500).send('Internal Server Error');
    }
};

exports.generateException = async (req, res, next) => {
    const simulationRequest = res.locals.simulationRequest;

    await SimulationService.generateException(simulationRequest);
};