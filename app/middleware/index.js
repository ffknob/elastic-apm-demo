const apm = require('elastic-apm-node').start({
    serviceName: process.env.ELASTIC_APM_SERVICE_NAME || 'elastic-apm-demo',
    serverUrl: process.env.ELASTIC_APM_SERVER_URL || 'http://apm-server:8200'
});

const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');
require('dotenv').config();

const BackgroundTask = require('./services/background-task');
let backgroundTaskId = 1;
setInterval(() => {
console.log(`Background task #${backgroundTaskId}`);
    let backgroundTask = new BackgroundTask();
    let userContext = { random: true };

    backgroundTask.execute(`Background task #${backgroundTaskId}`, 'task', 5, 10000, userContext);
    backgroundTaskId += 1;
}, 50000);

const simulationRoutes = require('./routes/simulation');

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

app.use('/simulation', simulationRoutes);

app.use((err, req, res, next) => {
    apm.captureError(err);
    res.status(err.statusCode  || 500).json({ error: true, message: err.message });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));