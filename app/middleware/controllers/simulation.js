const util = require('../shared/util.js');

exports.success = (req, res, next) => {
    const delay = req.body.delay;
    const response = { success: true };

    res.json(response);
};

exports.error = (req, res, next) => {
    const delay = req.body.delay;
    const maxDelay = req.body.maxDelay;
    const response = { error: true };

    setTimeout(() => res.json(response), util.randomDelay(maxDelay));
};

exports.exception = (req, res, next) => {
    const delay = req.body.delay;
    const response = { exception: true };

    res.json(response);
};