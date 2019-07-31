const util = require('../shared/util');
const ErrorGenerator = require('./error-generator');
const uuid = require('uuid');
const Fakerator = require('fakerator');
const apm = require('elastic-apm-node');

module.exports = class Simulation {
    constructor() { }

    static randomDelay(maxRandomDelay) {
        const delay = util.randomDelay(maxRandomDelay);
console.log(`Max. delay: ${maxRandomDelay}, Delay: ${delay}`);        
        return new Promise((resolve, reject) => {
            setTimeout(() => resolve(), delay)
        });
    }

    static setLabel(name, value) {
        apm.setLabel(name, value);
    }

    static setUserContext(simulationRequest) {
        let firstName = null;
        let lastName = null;
        let username = null;
        let email = null;
        const userContext = simulationRequest.userContext;
        const fakerator = Fakerator();

        if (simulationRequest.setRandomUserContext) {
            firstName = fakerator.names.firstName();
            lastName = fakerator.names.lastName();
            username = fakerator.internet.userName(firstName, lastName);
            email = fakerator.internet.email(firstName, lastName);
        } else {
            firstName = userContext.name.split(' ')[0];
            lastName = userContext.name.split(' ').reverse()[0];
            username= userContext.username;
            email = userContext.email;
        }

        apm.setUserContext({
            id: uuid.v4(),
            username: username,
            email: email
        });
    }

    static setCustomContext() {

    }

    static async generateSuccess(simulationRequest) {
        this.setUserContext(simulationRequest);
        await this.randomDelay(simulationRequest.maxRandomDelay);
    }

    static async generateThrownError(simulationRequest) {
        this.setUserContext(simulationRequest);
        await this.randomDelay(simulationRequest.maxRandomDelay);

        const errorGenerator = new ErrorGenerator();
        throw errorGenerator.getRandomError(); 
    }

    static async generateUncaughtError(simulationRequest) {
        this.setUserContext(simulationRequest);
        await this.randomDelay(simulationRequest.maxRandomDelay);

        const errorGenerator = new ErrorGenerator();
        apm.captureError(errorGenerator.getRandomError()); 
    }

    static async generateComplexTransaction(simulationRequest) {
        this.setUserContext(simulationRequest);
        await this.randomDelay(simulationRequest.maxRandomDelay);
    }
}