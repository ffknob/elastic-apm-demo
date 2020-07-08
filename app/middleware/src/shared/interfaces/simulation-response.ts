import SimulationResponseMetadata from './simulation-response-metadata';
import BackendError from './backend-error';

export default interface SimulationResponse {
    success: boolean;
    errors?: BackendError[];
    metadata?: SimulationResponseMetadata;
}
