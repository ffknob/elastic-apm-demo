const express = require('express');
const router = express.Router();

const requestParserController = require('../controllers/request-parser');
const simulationController = require('../controllers/simulation');

router.post('/success', requestParserController.requestParser, simulationController.generateSuccess);
router.post('/error', requestParserController.requestParser, simulationController.generateThrowError);
router.post('/exception', requestParserController.requestParser, simulationController.generateException);

module.exports = router;