const express = require('express');
const router = express.Router();

const requestParserController = require('../controllers/request-parser');
const simulationController = require('../controllers/simulation');

router.post('/success', requestParserController.requestParser, simulationController.generateSuccess);
router.post('/thrown-error', requestParserController.requestParser, simulationController.generateThrownError);
router.post('/captured-error', requestParserController.requestParser, simulationController.generateCapturedError);
router.post('/complex-transaction', requestParserController.requestParser, simulationController.generateComplexTransaction);
router.post('/distributed-transaction', requestParserController.requestParser, simulationController.generateDistributedTransaction);

module.exports = router;