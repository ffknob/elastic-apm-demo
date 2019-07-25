const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');
require('dotenv').config();

const simulationRoutes = require('./routes/simulation');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(morgan('tiny'));

app.use('/simulation', simulationRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT), () => console.log(`Server running on port ${PORT}`);