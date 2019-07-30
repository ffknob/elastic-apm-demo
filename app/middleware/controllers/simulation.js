const SimulationService = require('../services/simulation');

exports.generateSuccess = async (req, res, next) => {
    const simulationRequest = res.locals.simulationRequest;

    await SimulationService.generateSuccess(simulationRequest);

    res.status(200).send('done');
};

exports.generateThrownError = async (req, res, next) => {
    const simulationRequest = res.locals.simulationRequest;
    let error = new Error('Internal Server Error');

    try {
        await SimulationService.generateThrownError(simulationRequest);
    } catch(err) {
        error.statusCode = 500;
        error.message = err;
        throw error;
    }
};

exports.generateUncaughtError = async (req, res, next) => {
    const simulationRequest = res.locals.simulationRequest;
    let error = new Error('Internal Server Error');

    try {
        await SimulationService.generateUncaughtError(simulationRequest);
    } catch(err) {
        error.statusCode = 500;
        error.message = err;
    }

    throw error;
};

exports.generateException = async (req, res, next) => {
    const simulationRequest = res.locals.simulationRequest;

    await SimulationService.generateException(simulationRequest);
};