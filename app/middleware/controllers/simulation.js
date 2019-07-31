const SimulationService = require('../services/simulation');

exports.generateSuccess = async (req, res, next) => {
    const simulationRequest = res.locals.simulationRequest;

    await SimulationService.generateSuccess(simulationRequest);

    res.status(200).send('done');
};

exports.generateThrownError = async (req, res, next) => {
    const simulationRequest = res.locals.simulationRequest;

    try {
        await SimulationService.generateThrownError(simulationRequest);
    } catch(err) {
        next(err);
    }
};

exports.generateUncaughtError = async (req, res, next) => {
    const simulationRequest = res.locals.simulationRequest;

    await SimulationService.generateUncaughtError(simulationRequest);
};

exports.generateComplexTransaction = async (req, res, next) => {
    const simulationRequest = res.locals.simulationRequest;

    await SimulationService.generateComplexTransaction(simulationRequest);
};