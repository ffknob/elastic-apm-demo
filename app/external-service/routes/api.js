const express = require('express');
const router = express.Router();

const apiController = require('../controllers/api');

router.get('/:dataset/fetch', apiController.fetchAndSave);

module.exports = router;