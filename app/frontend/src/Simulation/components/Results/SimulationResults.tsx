import React, { useState, useContext } from 'react';

import {
    EuiText,
    EuiEmptyPrompt,
    EuiFlexGroup,
    EuiFlexItem
} from '@elastic/eui';

import SimulationExecutionTable from './Table/SimulationExecutionTable';
import SimulationStats from './Stats/SimulationStats';

import SimulationExecution from '../../../shared/interfaces/SimulationExecution';

import SimulationContext from '../../../shared/context/SimulationContext';
import ISimulationContext from '../../../shared/interfaces/SimulationContext';

import './SimulationResults.scss';

export interface SimulationResultsProps {}

const SimulationResults: React.FC<SimulationResultsProps> = (
    props: SimulationResultsProps
) => {
    const simulationContext: ISimulationContext = useContext(SimulationContext);

    const [
        selectedSimulationExecutions,
        setSelectedSimulationExecutions
    ] = useState<SimulationExecution[]>([]);

    const removeSimulationExecution = (
        selectedSimulationExecution: SimulationExecution[] | SimulationExecution
    ) => {
        /*const newSimulationResults: SimulationResult[] = simulationResults?.filter(
      (simulationResult: SimulationResult) => {
        return selectedSimulationResults instanceof Array
          ? selectedSimulationResults.indexOf(simulationResult) < 0
          : simulationResult !== selectedSimulationResults;
      }
    );

    setSelectedSimulationResults([]);*/
    };

    const noSimulationExecutions: React.ReactChild = (
        <EuiEmptyPrompt
            iconType="alert"
            title={<h2>No simulation results</h2>}
            body={
                <>
                    <p>
                        Once we have send some simulation requests you'll see a
                        table with which we'll be able to monitor those requests
                        as well as checking their results.
                    </p>
                    <p>
                        Send some simulation requests using the simulator in
                        order to see some results.
                    </p>
                </>
            }
        />
    );

    const simulationExecutionTable: React.ReactChild = (
        <EuiText>
            <h2>Results</h2>
            <SimulationExecutionTable
                onSelectedSimulationExecutionsChange={(
                    selectedSimulationExecution: SimulationExecution[]
                ) =>
                    setSelectedSimulationExecutions(selectedSimulationExecution)
                }
                onRemoveSimulationExecution={removeSimulationExecution}
            />
        </EuiText>
    );

    const simulationExecutions: React.ReactChild = (
        <EuiFlexGroup direction="column">
            <EuiFlexItem>
                <SimulationStats />
            </EuiFlexItem>
            <EuiFlexItem>{simulationExecutionTable}</EuiFlexItem>
        </EuiFlexGroup>
    );
    return simulationContext.simulations.length > 0
        ? simulationExecutions
        : noSimulationExecutions;
};

export default SimulationResults;
