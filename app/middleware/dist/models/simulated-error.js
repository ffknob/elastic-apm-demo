"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SimulatedError extends Error {
    constructor(message, statusCode, category) {
        super(message);
        this.statusCode = statusCode;
        this.category = category;
    }
}
exports.default = SimulatedError;
