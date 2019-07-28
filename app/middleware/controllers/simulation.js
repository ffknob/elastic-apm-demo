const SimulationService = require('../services/simulation');

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

exports.generateUncaughtError = async (req, res, next) => {
    const simulationRequest = res.locals.simulationRequest;

    try {
        await SimulationService.generateUncaughtError(simulationRequest);
        res.status(500).send('Internal Server Error');
    } catch(err) {
        res.status(500).send('Internal Server Error');
    }
};

exports.generateException = async (req, res, next) => {
    const simulationRequest = res.locals.simulationRequest;

    await SimulationService.generateException(simulationRequest);
};