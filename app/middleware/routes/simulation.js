const express = require('express');
const router = express.Router();

const simulationController = require('../controllers/simulation');

router.get('/success', simulationController.success);
router.get('/error', simulationController.error);
router.get('/exception', simulationController.exception);

module.exports = router;