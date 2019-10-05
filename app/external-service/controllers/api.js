const ApiService = require('../services/api');

exports.fetchAndSave = async (req, res, next) => {
    const dataset = req.params.dataset;

    await ApiService.fetchAndSave(dataset)
    .then(items => {
        console.log(`Got ${items.length} ${dataset} documents`);
        res.status(200).send();
    })
    .catch(err => { throw err; });

};