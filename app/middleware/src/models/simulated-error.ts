export default class SimulatedError extends Error {
    statusCode?: number;
    category?: string;

    constructor(message: string, statusCode?: number, category?: string) {
        super(message);

        this.statusCode = statusCode;
        this.category = category;
    }
}
