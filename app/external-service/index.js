const apm = require('elastic-apm-node').start({
    serviceName: process.env.ELASTIC_APM_EXTERNAL_SERVICE_NAME || 'elastic-apm-demo-external-service',
    serverUrl: process.env.ELASTIC_APM_SERVER_URL || 'http://apm-server:8200'
});

const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');
require('dotenv').config();

const apiRoutes = require('./routes/api');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(morgan('tiny'));

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
    next();
});

app.use('/api', apiRoutes);

app.use((err, req, res, next) => {
    apm.captureError(err);
    res.status(err.statusCode  || 500).json({ error: true, message: err.message });
});

const EXTERNAL_SERVICE_PORT = process.env.EXTERNAL_SERVICE_PORT || 3001;

app.listen(EXTERNAL_SERVICE_PORT, () => console.log(`Server running on port ${EXTERNAL_SERVICE_PORT}`));
