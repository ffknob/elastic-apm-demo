import axios from 'axios';
import uuid from 'uuid';
import SPAN_TYPES from '../shared/constants/span-types';
import { randomNumber } from '../shared/util';
import ApmService from './apm';
import DelayGenerator from './delay-generator';
import ErrorGenerator from './error-generator';
import LabelGenerator from './label-generator';

class Simulation {
    constructor() {}

    createUserContext(simulationRequest) {
        const userContext = simulationRequest.userContext;

        if (userContext) {
            return {
                random: simulationRequest.setRandomUserContext,
                id: userContext.id,
                username: userContext.username,
                email: userContext.email
            };
        } else {
            return { random: true };
        }
    }

    async init(simulationRequest, delayOnInit) {
        const apmService = ApmService.getInstance();
        const delayGenerator = new DelayGenerator();

        const userContext = this.createUserContext(simulationRequest);
        apmService.setUserContext(userContext);

        if (simulationRequest.setRandomLabels) {
            const labelGenerator = new LabelGenerator();
            const label = labelGenerator.getRandomLabel();
            apmService.setLabel(label.name, label.value);
        } else {
            if (simulationRequest.labels) {
                simulationRequest.labels.forEach(label =>
                    apmService.setLabel(label.name, label.value)
                );
            }
        }

        if (delayOnInit) {
            await delayGenerator
                .randomDelay(simulationRequest.maxRandomDelay)
                .then((delay: number) =>
                    apmService.setLabel('random-delay', delay)
                );
        }
    }

    async generateSuccess(simulationRequest) {
        await this.init(simulationRequest, true);
    }

    async generateThrownError(simulationRequest) {
        await this.init(simulationRequest, true);

        const errorGenerator = new ErrorGenerator();
        throw errorGenerator.getRandomError();
    }

    async generateCapturedError(simulationRequest) {
        const apmService = ApmService.getInstance();

        await this.init(simulationRequest, true);

        const errorGenerator = new ErrorGenerator();
        const error = errorGenerator.getRandomError();

        apmService.captureError(error, {
            handled: false,
            custom: {
                fake: true,
                category: error.category,
                statusCode: error.statusCode
            }
        });
    }

    async generateComplexTransaction(simulationRequest) {
        const apmService = ApmService.getInstance();
        const delayGenerator = new DelayGenerator();

        const complexTransaction = simulationRequest.complexTransaction;
        const traceparent = apmService.getCurrentTraceparent();

        await this.init(simulationRequest, false);

        for (let i = 0; i < complexTransaction.totalSubTransactions; i++) {
            let subTransactionName = `Sub-transaction #${i}`;
            let subTransactionType = 'custom';
            let subTransactionId = uuid.v4().split('-')[0];
            let subTransaction;

            if (traceparent) {
                subTransaction = apmService.startTransaction(
                    `${subTransactionName} (${subTransactionId})`,
                    subTransactionType,
                    { childOf: traceparent! }
                );
            }

            for (let j = 0; j < complexTransaction.totalSpans; j++) {
                let randomSpanTypeIndex = randomNumber(SPAN_TYPES.length);

                let span;
                if (subTransaction) {
                    span = subTransaction.startSpan(
                        `Span #${i}.${j}`,
                        SPAN_TYPES[randomSpanTypeIndex]
                    );
                }

                await delayGenerator.randomDelay(
                    simulationRequest.maxRandomDelay
                );

                if (span) span.end();

                await delayGenerator.randomDelay(
                    simulationRequest.maxRandomDelay
                );
            }

            if (subTransaction) subTransaction.end();
        }
    }

    async generateDistributedTransaction(simulationRequest) {
        const datasets = ['users', 'todos', 'comments', 'albuns', 'photos'];
        const randomIndex = Math.floor(Math.random() * datasets.length);
        const fetchAndSaveEndpoint = `http://external-service:3000/api/${datasets[randomIndex]}/fetch`;

        await this.init(simulationRequest, false);

        return await axios.get(fetchAndSaveEndpoint);
    }
}

export default Simulation;
