import { randomNumber } from '../shared/util';

class DelayGenerator {
    constructor() {}

    randomDelay(maxRandomDelay: number) {
        const delay: number = randomNumber(maxRandomDelay);

        return new Promise<number>(resolve => {
            setTimeout(() => resolve(delay), delay);
        });
    }
}

export default DelayGenerator;
