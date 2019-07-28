const express = require('express');
const router = express.Router();

const requestParserController = require('../controllers/request-parser');
const simulationController = require('../controllers/simulation');

router.post('/success', requestParserController.requestParser, simulationController.generateSuccess);
router.post('/thrown-error', requestParserController.requestParser, simulationController.generateThrownError);
router.post('/uncaught-error', requestParserController.requestParser, simulationController.generateUncaughtError);
router.post('/exception', requestParserController.requestParser, simulationController.generateException);

module.exports = router;