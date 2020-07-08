import SimulationRequestError from './SimulationRequestError';

export default interface BackendError<U> {
    errors?: Array<SimulationRequestError>;
}
