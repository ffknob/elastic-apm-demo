const util = require('../shared/util');

module.exports = class Simulation {
    constructor() { }

    static randomDelay(maxRandomDelay) {
        return new Promise((resolve, reject) => {
            setTimeout(() => resolve(),  util.randomDelay(maxRandomDelay))
        });
    }

    static setLabel(name, value) {
        apm.setLabel(name, value);
    }

    static async generateSuccess(maxRandomDelay) {
        await this.randomDelay(maxRandomDelay);
    }

    static async generateThrowError(maxRandomDelay) {
        const error = new Error('This is an error');
        await this.randomDelay(maxRandomDelay);
        throw error; 
    }

    static async generateUncaughtError(maxRandomDelay) {
        const error = new Error('This is an error');
        await this.randomDelay(maxRandomDelay);
        apm.captureError(error); 
    }

    static async generateException(maxRandomDelay) {
        await this.randomDelay(maxRandomDelay);
        throw new Error('This is an error');
    }
}