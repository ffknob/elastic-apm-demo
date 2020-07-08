"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../shared/util");
class DelayGenerator {
    constructor() { }
    randomDelay(maxRandomDelay) {
        const delay = util_1.randomNumber(maxRandomDelay);
        return new Promise(resolve => {
            setTimeout(() => resolve(delay), delay);
        });
    }
}
exports.default = DelayGenerator;
