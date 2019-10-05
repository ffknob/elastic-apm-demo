const util = require('../shared/util');

module.exports = class DelayGenerator {
    constructor() { }

    randomDelay(maxRandomDelay) {
        const delay = util.randomNumber(maxRandomDelay);
   
        return new Promise((resolve, reject) => {
            setTimeout(() => resolve(delay), delay)
        });
    }
}