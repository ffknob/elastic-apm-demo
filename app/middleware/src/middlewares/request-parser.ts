import { Request, Response, NextFunction } from 'express';

import SimulationRequest from '../shared/interfaces/simulation-request';

import logger from '../services/logger';

const requestParser = (req: Request, res: Response, next: NextFunction) => {
    const simulationParameters = req.body.parameters;
    const simulationOptions = req.body.options;

    const { maxRandomDelay } = simulationParameters;
    const {
        randomUserContext,
        userContext,
        randomCustomContext,
        customContext,
        randomLabels,
        labels,
        complexTransaction,
        distributedTransaction
    } = simulationOptions;

    const simulationRequest: SimulationRequest = {
        maxRandomDelay,
        randomUserContext,
        userContext,
        randomCustomContext,
        customContext,
        randomLabels,
        labels,
        complexTransaction,
        distributedTransaction
    };

    logger.debug(simulationRequest);

    res.locals.simulationRequest = simulationRequest;

    next();
};

export default { requestParser };
