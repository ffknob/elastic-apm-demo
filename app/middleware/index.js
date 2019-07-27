const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');
require('dotenv').config();

const simulationRoutes = require('./routes/simulation');

const apm = require('elastic-apm-node').start({
    serviceName: process.env.ELASTIC_APM_SERVICE_NAME || 'elastic-apm-demo',
    serverUrl: process.env.ELASTIC_APM_SERVER_URL || 'http://localhost:8200'
});

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(morgan('tiny'));

// CORS↲
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
    next();
});

app.use('/simulation', simulationRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT), () => console.log(`Server running on port ${PORT}`);