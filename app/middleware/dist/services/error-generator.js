"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SIMULATED_ERRORS = [
    require('../shared/simulated-errors/http/error-0.js'),
    require('../shared/simulated-errors/http/error-1.js'),
    require('../shared/simulated-errors/http/error-2.js'),
    require('../shared/simulated-errors/http/error-3.js'),
    require('../shared/simulated-errors/http/error-4.js'),
    require('../shared/simulated-errors/http/error-5.js'),
    require('../shared/simulated-errors/http/error-6.js'),
    require('../shared/simulated-errors/http/error-7.js'),
    require('../shared/simulated-errors/http/error-8.js'),
    require('../shared/simulated-errors/http/error-9.js'),
    require('../shared/simulated-errors/http/error-10.js'),
    require('../shared/simulated-errors/http/error-11.js'),
    require('../shared/simulated-errors/http/error-12.js'),
    require('../shared/simulated-errors/http/error-13.js'),
    require('../shared/simulated-errors/http/error-14.js'),
    require('../shared/simulated-errors/http/error-15.js'),
    require('../shared/simulated-errors/http/error-16.js'),
    require('../shared/simulated-errors/http/error-17.js'),
    require('../shared/simulated-errors/http/error-18.js'),
    require('../shared/simulated-errors/http/error-19.js'),
    require('../shared/simulated-errors/http/error-20.js'),
    require('../shared/simulated-errors/http/error-21.js'),
    require('../shared/simulated-errors/http/error-22.js'),
    require('../shared/simulated-errors/http/error-23.js'),
    require('../shared/simulated-errors/http/error-24.js'),
    require('../shared/simulated-errors/http/error-25.js'),
    require('../shared/simulated-errors/http/error-26.js'),
    require('../shared/simulated-errors/http/error-27.js'),
    require('../shared/simulated-errors/http/error-28.js'),
    require('../shared/simulated-errors/http/error-29.js'),
    require('../shared/simulated-errors/http/error-30.js'),
    require('../shared/simulated-errors/http/error-31.js'),
    require('../shared/simulated-errors/http/error-32.js'),
    require('../shared/simulated-errors/http/error-33.js'),
    require('../shared/simulated-errors/http/error-34.js'),
    require('../shared/simulated-errors/http/error-35.js'),
    require('../shared/simulated-errors/http/error-36.js'),
    require('../shared/simulated-errors/http/error-37.js'),
    require('../shared/simulated-errors/http/error-38.js'),
    require('../shared/simulated-errors/elasticsearch-js/error-0.js'),
    require('../shared/simulated-errors/elasticsearch-js/error-1.js'),
    require('../shared/simulated-errors/elasticsearch-js/error-2.js'),
    require('../shared/simulated-errors/elasticsearch-js/error-3.js'),
    require('../shared/simulated-errors/elasticsearch-js/error-4.js'),
    require('../shared/simulated-errors/elasticsearch-js/error-5.js'),
    require('../shared/simulated-errors/elasticsearch-js/error-6.js'),
    require('../shared/simulated-errors/elasticsearch-js/error-7.js'),
    require('../shared/simulated-errors/elasticsearch-js/error-8.js'),
    require('../shared/simulated-errors/mongoose/error-0.js'),
    require('../shared/simulated-errors/mongoose/error-1.js'),
    require('../shared/simulated-errors/mongoose/error-2.js'),
    require('../shared/simulated-errors/mongoose/error-3.js'),
    require('../shared/simulated-errors/mongoose/error-4.js'),
    require('../shared/simulated-errors/mongoose/error-5.js'),
    require('../shared/simulated-errors/mongoose/error-6.js'),
    require('../shared/simulated-errors/mongoose/error-7.js'),
    require('../shared/simulated-errors/mongoose/error-8.js'),
    require('../shared/simulated-errors/mongoose/error-9.js')
];
class ErrorGenerator {
    constructor() { }
    getRandomError(category) {
        const errors = exports.SIMULATED_ERRORS.filter(e => !category ? true : e.category === category);
        const randomErrorIndex = Math.floor(Math.random() * errors.length);
        const randomErrorGenerator = errors[randomErrorIndex];
        return randomErrorGenerator.generate();
    }
}
exports.default = ErrorGenerator;
