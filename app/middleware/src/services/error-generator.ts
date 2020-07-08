import SimulatedError from '../models/simulated-error';
import SimulatedErrorFactory from '../models/simulated-error-factory';
import SIMULATED_ERRORS from '../shared/simulated-errors/simulated-errors';

class ErrorGenerator {
    constructor() {}

    getRandomError(category?: string): SimulatedError {
        const errors = SIMULATED_ERRORS.filter(e =>
            !category ? true : e.category === category
        );

        const randomErrorIndex: number = Math.floor(
            Math.random() * errors.length
        );
        const randomErrorGenerator: SimulatedErrorFactory =
            errors[randomErrorIndex];

        return randomErrorGenerator.generate();
    }
}

export default ErrorGenerator;
