"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const simulated_error_factory_1 = __importDefault(require("../../../models/simulated-error-factory"));
const CATEGORY = 'http';
const STATUS_CODE = 505;
const ERROR_MESSAGE = 'HTTP Version Not Supported';
class _ extends simulated_error_factory_1.default {
    constructor() {
        super(...arguments);
        this.category = CATEGORY;
        this.generate = () => {
            const error = {
                name: 'Simulated Error: HTTP',
                category: CATEGORY,
                statusCode: STATUS_CODE,
                message: ERROR_MESSAGE,
            };
            return error;
        };
    }
}
exports.default = _;
