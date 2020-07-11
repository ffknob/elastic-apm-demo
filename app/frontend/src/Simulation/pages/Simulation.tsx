import React, { useState } from 'react';

import { EuiFlexGroup, EuiFlexItem } from '@elastic/eui';

import { Page } from '../../shared/layout/Page';

import SimulationContext from '../../shared/context/SimulationContext';

import { Simulator } from '../components/Simulator';
import { SimulationResults } from '../components/Results';

import Request from '../../shared/interfaces/Request';
import ISimulation from '../../shared/interfaces/Simulation';
import SimulationRequest from '../../shared/interfaces/SimulationRequest';
import SimulationRequestResult from '../../shared/interfaces/SimulationRequestResult';
import SimulationStats from '../../shared/interfaces/SimulationStats';

import SimulationType from '../../shared/types/SimulationType';

import { executeSimulation } from '../../shared/services/simulation/simulation';

import SimulationRequestError from '../../shared/interfaces/SimulationRequestError';
import BackendSuccess from '../../shared/interfaces/BackendSuccess';
import BackendError from '../../shared/interfaces/BackendError';

import './Simulation.scss';

const Simulation: React.FC = () => {
    const [simulations, setSimulations] = useState<ISimulation[]>([]);

    const includeSimulation = (simulation: ISimulation) => {
        setSimulations((simulations: ISimulation[]) => {
            return [...simulations, simulation];
        });
    };

    const updateSimulation = (simulation: ISimulation) => {
        setSimulations((simulations: ISimulation[]) =>
            simulations.map((_simulation: ISimulation) =>
                _simulation.id === simulation.id ? simulation : _simulation
            )
        );
    };

    const executeSimulationHandler = (
        simulationType: SimulationType,
        simulationRequest: SimulationRequest
    ) => {
        const simulation: ISimulation | void = executeSimulation(
            simulationType,
            simulationRequest
        );

        includeSimulation(simulation);

        if (simulation.requests$) {
            simulation.requests$.subscribe(
                (
                    requests: Request<
                        SimulationRequest,
                        | BackendSuccess<SimulationRequestResult>
                        | BackendError<SimulationRequestError>
                    >[]
                ) => updateSimulation({ ...simulation, requests })
            );
        }

        if (simulation.stats$) {
            simulation.stats$.subscribe((stats: SimulationStats) =>
                updateSimulation({ ...simulation, stats })
            );
        }
    };

    return (
        <SimulationContext.Provider
            value={{
                simulations: simulations,
                executeSimulation: executeSimulationHandler
            }}>
            <Page pageTitle="Simulation">
                <EuiFlexGroup>
                    <EuiFlexItem grow={false}>
                        <Simulator />
                    </EuiFlexItem>
                    <EuiFlexItem>
                        <SimulationResults />
                    </EuiFlexItem>
                </EuiFlexGroup>
            </Page>
        </SimulationContext.Provider>
    );
};

export default Simulation;
