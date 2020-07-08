import winston, { Logger } from 'winston';

const logger: Logger = winston.createLogger({
    transports: [new winston.transports.Console()]
});

export default logger;
