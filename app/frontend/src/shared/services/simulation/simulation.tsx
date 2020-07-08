import { v4 as uuid } from 'uuid';
import { Subject, interval } from 'rxjs';
import { take } from 'rxjs/operators';

import Simulation from '../../interfaces/Simulation';
import SimulationRequest from '../../interfaces/SimulationRequest';
import SimulationRequestResult from '../../interfaces/SimulationRequestResult';
import SimulationStats from '../../interfaces/SimulationStats';
import Request from '../../interfaces/Request';

import SimulationType from '../../types/SimulationType';

import { simulate } from '../api/SimulationApi';
import SimulationRequestError from '../../interfaces/SimulationRequestError';
import BackendSuccess from '../../interfaces/BackendSuccess';
import BackendError from '../../interfaces/BackendError';
import BackendResponse from '../../interfaces/BackendResponse';

const createRequest = (
    simulation: Simulation
): Request<
    SimulationRequest,
    | BackendSuccess<SimulationRequestResult>
    | BackendError<SimulationRequestError>
> => {
    simulation.stats!.total =
        simulation.simulationRequest?.parameters.numberOfRequests;
    simulation.stats!.sent = simulation.stats!.sent! + 1;

    return simulate(simulation);
};

const updateStats = (
    simulation: Simulation,
    simulationRequest: Request<
        SimulationRequest,
        | BackendSuccess<SimulationRequestResult>
        | BackendError<SimulationRequestError>
    >,
    backendResponse: BackendResponse<
        | BackendSuccess<SimulationRequestResult>
        | BackendError<SimulationRequestError>
    >
) => {
    simulation.stats!.completed! = simulation!.stats!.completed! + 1;

    simulationRequest.time.end = new Date();
    simulationRequest.time.took =
        simulationRequest.time.end.getTime() -
        simulationRequest.time.start.getTime();

    simulation.stats!.time!.took =
        simulationRequest.time.end.getTime() -
        simulation.stats!.time!.start.getTime();

    if (!simulation.stats?.time?.min) {
        simulation.stats!.time!.min = simulationRequest.time.took;
    } else {
        simulation.stats!.time!.min =
            simulation.stats!.time!.min > simulationRequest.time.took
                ? simulationRequest.time.took
                : simulation.stats!.time!.min;
    }

    if (!simulation.stats?.time?.max) {
        simulation.stats!.time!.max = simulationRequest.time.took;
    } else {
        simulation.stats!.time!.max =
            simulation.stats!.time!.max < simulationRequest.time.took
                ? simulationRequest.time.took
                : simulation.stats!.time!.max;
    }

    if (!simulation.stats?.time?.avg) {
        simulation.stats!.time!.avg = simulationRequest.time.took;
    } else {
        simulation.stats!.time!.avg =
            (simulation.stats!.time!.avg + simulationRequest.time.took) / 2;
    }

    /*if (backendResponse.success) {
        const response: BackendResponse<BackendSuccess<
            SimulationRequestResult
        >> = backendResponse as BackendResponse<
            BackendSuccess<SimulationRequestResult>
        >;
    } else {
        const response: BackendResponse<BackendError<
            SimulationRequestResult
        >> = backendResponse as BackendResponse<
            BackendError<SimulationRequestResult>
        >;
    }
         */
    simulation.stats$?.next(simulation.stats);
};

export const executeSimulation = (
    simulationType: SimulationType,
    simulationRequest: SimulationRequest
): Simulation => {
    const simulation: Simulation = {
        id: uuid(),
        type: simulationType,
        simulationRequest: simulationRequest,
        requests: [],
        requests$: new Subject<
            Request<
                SimulationRequest,
                | BackendSuccess<SimulationRequestResult>
                | BackendError<SimulationRequestError>
            >[]
        >(),
        stats: {
            total: 0,
            sent: 0,
            completed: 0,
            timedOut: 0,
            time: {
                start: new Date()
            }
        },
        stats$: new Subject<SimulationStats>()
    };

    interval(simulationRequest.parameters.interval)
        .pipe(take(simulationRequest.parameters.numberOfRequests))
        .subscribe((index: number) => {
            if (!simulation.requests) {
                simulation.requests = [];
            }

            const request = createRequest(simulation);

            request.response$!.subscribe(
                response => {
                    request.response = response;

                    updateStats(simulation, request, response);
                },
                err => {
                    request.response = err;

                    updateStats(simulation, request, err);
                }
            );

            simulation.requests.push(request);
            simulation.requests$?.next(simulation.requests);
            simulation.stats$?.next(simulation.stats);
        });

    return simulation;
};

export default { executeSimulation };
