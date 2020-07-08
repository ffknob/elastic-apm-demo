import * as dotenv from 'dotenv';
dotenv.config();

import ApmService from './services/apm';

import express, { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import winston from 'winston';
import expressWinston from 'express-winston';

import BackendError from './shared/interfaces/backend-error';
import simulationRoutes from './routes/simulation';
import SimulationResponse from './shared/interfaces/simulation-response';

const apmService = ApmService.getInstance();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

/*const BackgroundTask = require('./services/background-task');
let backgroundTaskId = 1;
setInterval(() => {
console.log(`Background task #${backgroundTaskId}`);
    let backgroundTask = new BackgroundTask();
    let userContext = { random: true };

    backgroundTask.execute(`Background task #${backgroundTaskId}`, 'task', 5, 10000, userContext);
    backgroundTaskId += 1;
}, 50000);*/

app.use(
    expressWinston.logger({
        transports: [new winston.transports.Console()],
        meta: true,
        msg: 'HTTP {{req.method}} {{req.url}}',
        expressFormat: true,
        colorize: false
    })
);

app.use(
    expressWinston.errorLogger({
        transports: [new winston.transports.Console()]
    })
);

app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    );
    res.setHeader(
        'Access-Control-Allow-Methods',
        'POST, GET, PATCH, DELETE, OPTIONS'
    );
    next();
});

app.use('/api/v1/simulate', simulationRoutes);

app.use(
    (err: BackendError, req: Request, res: Response, next: NextFunction) => {
        apmService.captureError(err);

        const simulationResponse: SimulationResponse = {
            success: false,
            errors: [err],
            metadata: res.locals.metadata
        };

        res.status(err.statusCode || 500).json(simulationResponse);
    }
);

const MIDDLEWARE_PORT: Number = process.env.MIDDLEWARE_PORT
    ? parseInt(process.env.MIDDLEWARE_PORT)
    : 3000;

app.listen(MIDDLEWARE_PORT, () =>
    console.log(`Server running on port ${MIDDLEWARE_PORT}`)
);
