"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const uuid_1 = __importDefault(require("uuid"));
const span_types_1 = __importDefault(require("../shared/constants/span-types"));
const util_1 = require("../shared/util");
const apm_1 = __importDefault(require("./apm"));
const delay_generator_1 = __importDefault(require("./delay-generator"));
const error_generator_1 = __importDefault(require("./error-generator"));
const label_generator_1 = __importDefault(require("./label-generator"));
class Simulation {
    constructor() { }
    createUserContext(simulationRequest) {
        const userContext = simulationRequest.userContext;
        if (userContext) {
            return {
                random: simulationRequest.setRandomUserContext,
                id: userContext.id,
                username: userContext.username,
                email: userContext.email,
            };
        }
        else {
            return { random: true };
        }
    }
    init(simulationRequest, delayOnInit) {
        return __awaiter(this, void 0, void 0, function* () {
            const apmService = new apm_1.default();
            const delayGenerator = new delay_generator_1.default();
            const userContext = this.createUserContext(simulationRequest);
            apmService.setUserContext(userContext);
            if (simulationRequest.setRandomLabels) {
                const labelGenerator = new label_generator_1.default();
                const label = labelGenerator.getRandomLabel();
                apmService.setLabel(label.name, label.value);
            }
            else {
                simulationRequest.labels.forEach((label) => apmService.setLabel(label.name, label.value));
            }
            if (delayOnInit) {
                yield delayGenerator
                    .randomDelay(simulationRequest.maxRandomDelay)
                    .then((delay) => apmService.setLabel('random-delay', delay));
            }
        });
    }
    generateSuccess(simulationRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.init(simulationRequest, true);
        });
    }
    generateThrownError(simulationRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.init(simulationRequest, true);
            const errorGenerator = new error_generator_1.default();
            throw errorGenerator.getRandomError();
        });
    }
    generateCapturedError(simulationRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            const apmService = new apm_1.default();
            yield this.init(simulationRequest, true);
            const errorGenerator = new error_generator_1.default();
            const error = errorGenerator.getRandomError();
            apmService.captureError(error, {
                handled: false,
                custom: {
                    fake: true,
                    category: error.category,
                    statusCode: error.statusCode,
                },
            });
        });
    }
    generateComplexTransaction(simulationRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            const apmService = new apm_1.default();
            const delayGenerator = new delay_generator_1.default();
            const complexTransaction = simulationRequest.complexTransaction;
            const traceparent = apmService.getCurrentTraceparent();
            yield this.init(simulationRequest, false);
            for (let i = 0; i < complexTransaction.totalSubTransactions; i++) {
                let subTransactionName = `Sub-transaction #${i}`;
                let subTransactionType = 'custom';
                let subTransactionId = uuid_1.default.v4().split('-')[0];
                let subTransaction;
                if (traceparent) {
                    subTransaction = apmService.startTransaction(`${subTransactionName} (${subTransactionId})`, subTransactionType, { childOf: traceparent });
                }
                for (let j = 0; j < complexTransaction.totalSpans; j++) {
                    let randomSpanTypeIndex = util_1.randomNumber(span_types_1.default.length);
                    let span;
                    if (subTransaction) {
                        span = subTransaction.startSpan(`Span #${i}.${j}`, span_types_1.default[randomSpanTypeIndex]);
                    }
                    yield delayGenerator.randomDelay(simulationRequest.maxRandomDelay);
                    if (span)
                        span.end();
                    yield delayGenerator.randomDelay(simulationRequest.maxRandomDelay);
                }
                if (subTransaction)
                    subTransaction.end();
            }
        });
    }
    generateDistributedTransaction(simulationRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            const datasets = ['users', 'todos', 'comments', 'albuns', 'photos'];
            const randomIndex = Math.floor(Math.random() * datasets.length);
            const fetchAndSaveEndpoint = `http://external-service:3000/api/${datasets[randomIndex]}/fetch`;
            yield this.init(simulationRequest, false);
            return yield axios_1.default.get(fetchAndSaveEndpoint);
        });
    }
}
exports.default = Simulation;
