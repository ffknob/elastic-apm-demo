"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const simulated_error_factory_1 = __importDefault(require("../../../models/simulated-error-factory"));
const CATEGORY = 'mongoose';
const STATUS_CODE = 500;
const ERROR_MESSAGE = 'Ran out of retries trying to reconnect to "mongodb://...". Try setting `server.reconnectTries` and `server.reconnectInterval` to something higher.';
class _ extends simulated_error_factory_1.default {
    constructor() {
        super(...arguments);
        this.category = CATEGORY;
        this.generate = () => {
            const error = {
                name: 'Simulated Error: Mongoose',
                category: CATEGORY,
                statusCode: STATUS_CODE,
                message: ERROR_MESSAGE,
            };
            return error;
        };
    }
}
exports.default = _;
