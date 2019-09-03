const Simulation = require('../services/simulation');

exports.generateSuccess = async (req, res, next) => {
    const simulationRequest = res.locals.simulationRequest;
    const simulation = new Simulation();

    await simulation.generateSuccess(simulationRequest);

    res.status(200).send();
};

exports.generateThrownError = async (req, res, next) => {
    const simulationRequest = res.locals.simulationRequest;
    const simulation = new Simulation();

    try {
        await simulation.generateThrownError(simulationRequest);
    } catch(err) {
        next(err);
    }
};

exports.generateCapturedError = async (req, res, next) => {
    const simulationRequest = res.locals.simulationRequest;
    const simulation = new Simulation();

    await simulation.generateCapturedError(simulationRequest);
};

exports.generateComplexTransaction = async (req, res, next) => {
    const simulationRequest = res.locals.simulationRequest;
    const simulation = new Simulation();

    await simulation.generateComplexTransaction(simulationRequest);

    res.status(200).send();
};

exports.generateDistributedTransaction = async (req, res, next) => {
    const simulationRequest = res.locals.simulationRequest;
    const simulation = new Simulation();

    await simulation.generateDistributedTransaction(simulationRequest);

    res.status(200).send();
};