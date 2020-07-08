import React from 'react';

import SimulationExecutionRequestsTable from './SimulationExecutionRequestsTable';

import './SimulationExecutionTableRowDetails.scss';

export interface SimulationExecutionTableRowDetailsProps {
    simulationId: string;
}

const SimulationExecutionTableRowDetails: React.FC<SimulationExecutionTableRowDetailsProps> = (
    props: SimulationExecutionTableRowDetailsProps
) => {
    const { simulationId } = props;

    return <SimulationExecutionRequestsTable simulationId={simulationId} />;
};

export default SimulationExecutionTableRowDetails;
