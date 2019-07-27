const util = require('../shared/util');
const uuid = require('uuid');
const fakerator = require('fakerator');

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

    static setUserContext(userContext) {
        const firstName = fakerator.names.firstName();
        const lastName = fakerator.names.lastName();
        const email = fakerator.internet.email(firstName, lastName);

        apm.setUserContext({
            id: uuid.v4(),
            username: firstname.lowercase(),
            email: email
        });
    }

    static setCustomContext() {

    }

    static async generateSuccess(simulationRequest) {
        await this.randomDelay(simulationRequest.maxRandomDelay);

        
    }

    static async generateThrownError(simulationRequest) {
        const error = new Error('This is an error');
        await this.randomDelay(simulationRequest.maxRandomDelay);
        throw error; 
    }

    static async generateUncaughtError(simulationRequest) {
        const error = new Error('This is an error');
        await this.randomDelay(simulationRequest.maxRandomDelay);
        apm.captureError(error); 
    }

    static async generateException(maxRandomDelay) {
        await this.randomDelay(maxRandomDelay);
        throw new Error('This is an error');
    }
}