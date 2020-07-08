"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CATEGORY = 'elasticsearch-js';
const STATUS_CODE = 500;
const ERROR_MESSAGE = 'Request timed out';
class _ {
    constructor() {
        this.category = CATEGORY;
        this.generate = () => {
            const error = {
                name: 'Simulated Error: Elasticsearch',
                category: CATEGORY,
                statusCode: STATUS_CODE,
                message: ERROR_MESSAGE,
            };
            return error;
        };
    }
}
exports.default = _;
