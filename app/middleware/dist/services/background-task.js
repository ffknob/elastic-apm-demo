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
const uuid_1 = __importDefault(require("uuid"));
const span_types_1 = __importDefault(require("../shared/constants/span-types"));
const util_1 = require("../shared/util");
const apm_1 = __importDefault(require("./apm"));
const delay_generator_1 = __importDefault(require("./delay-generator"));
class BackgroundTask {
    constructor() { }
    execute(transactionName, transactionType, totalSpans, maxRandomDelay, userContext) {
        return __awaiter(this, void 0, void 0, function* () {
            const apmService = new apm_1.default();
            const delayGenerator = new delay_generator_1.default();
            const transactionId = uuid_1.default.v4().split('-')[0];
            const transaction = apmService.startTransaction(`${transactionName} (${transactionId})`, transactionType);
            apmService.setUserContext(userContext);
            for (let i = 0; i < totalSpans; i++) {
                let randomSpanTypeIndex = util_1.randomNumber(span_types_1.default.length);
                let span = apmService.startSpan(`Span #${i}`, span_types_1.default[randomSpanTypeIndex]);
                yield delayGenerator.randomDelay(maxRandomDelay);
                if (span)
                    span.end();
                yield delayGenerator.randomDelay(maxRandomDelay);
            }
            if (transaction)
                transaction.end();
        });
    }
}
exports.default = BackgroundTask;
