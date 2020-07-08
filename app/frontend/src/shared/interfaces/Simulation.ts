import { Subject } from 'rxjs';

import SimulationRequest from './SimulationRequest';
import SimulationStats from './SimulationStats';
import Request from './Request';

import SimulationType from '../types/SimulationType';
import BackendSuccess from './BackendSuccess';
import SimulationRequestResult from './SimulationRequestResult';
import BackendError from './BackendError';
import SimulationRequestError from './SimulationRequestError';

export default interface Simulation {
    id?: string;
    type: SimulationType;
    text?: string;
    color?: string;
    totalSubTransactions?: number;
    totalSpans?: number;
    simulationRequest?: SimulationRequest;
    requests?: Request<
        SimulationRequest,
        | BackendSuccess<SimulationRequestResult>
        | BackendError<SimulationRequestError>
    >[];
    requests$?: Subject<
        Request<
            SimulationRequest,
            | BackendSuccess<SimulationRequestResult>
            | BackendError<SimulationRequestError>
        >[]
    >;
    stats?: SimulationStats;
    stats$?: Subject<SimulationStats>;
}
