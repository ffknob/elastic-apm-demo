const ApiService = require('../services/api');

exports.fetchAndSave = async (req, res, next) => {
    const dataset = req.params.dataset;

    await ApiService.fetchAndSave(dataset);

    res.status(200).send();
};