"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const requestParser = (req, res, next) => {
    const simulationParameters = req.body.parameters;
    const simulationOptions = req.body.options;
    console.log(req.body);
    const { maxRandomDelay } = simulationParameters;
    const { randomUserContext, userContext, randomCustomContext, customContext, randomLabels, labels, complexTransaction, distributedTransaction, } = simulationOptions;
    const simulationRequest = {
        maxRandomDelay,
        randomUserContext,
        userContext,
        randomCustomContext,
        customContext,
        randomLabels,
        labels,
        complexTransaction,
        distributedTransaction,
    };
    console.log(simulationRequest);
    res.locals.simulationRequest = simulationRequest;
    next();
};
exports.default = { requestParser };
