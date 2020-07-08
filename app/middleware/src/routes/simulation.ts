import express from 'express';

import metadataMiddleware from '../middlewares/metadata';
import requestParserController from '../middlewares/request-parser';
import simulationController from '../controllers/simulation';

const router = express.Router();

router.post(
    '/success',
    requestParserController.requestParser,
    metadataMiddleware,
    simulationController.generateSuccess
);
router.post(
    '/thrown-error',
    requestParserController.requestParser,
    metadataMiddleware,
    simulationController.generateThrownError
);
router.post(
    '/captured-error',
    requestParserController.requestParser,
    metadataMiddleware,
    simulationController.generateCapturedError
);
router.post(
    '/complex-transaction',
    requestParserController.requestParser,
    metadataMiddleware,
    simulationController.generateComplexTransaction
);
router.post(
    '/distributed-transaction',
    requestParserController.requestParser,
    metadataMiddleware,
    simulationController.generateDistributedTransaction
);

export default router;
