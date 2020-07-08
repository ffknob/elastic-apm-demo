import React from 'react';

import { EuiFlexGroup, EuiFlexItem, EuiButton } from '@elastic/eui';

import {
    SUCCESS,
    THROWN_ERROR,
    CAPTURED_ERROR,
    COMPLEX_TRANSACTION,
    DISTRIBUTED_TRANSACTION
} from '../../Simulator';

import SimulationType from '../../../../../shared/types/SimulationType';

import './SimulatorActions.scss';

export interface SimulatorActions {
    onExecuteSimulation: (simulationType: SimulationType) => void;
}

const SimulatorActions: React.FC<SimulatorActions> = (
    props: SimulatorActions
) => {
    const { onExecuteSimulation } = props;

    return (
        <>
            <EuiFlexGroup gutterSize="s" alignItems="center">
                <EuiFlexItem grow={false}>
                    <EuiButton
                        color="secondary"
                        onClick={() => onExecuteSimulation(SUCCESS.type)}>
                        Success
                    </EuiButton>
                </EuiFlexItem>

                <EuiFlexItem grow={false}>
                    <EuiButton
                        color="danger"
                        onClick={() => onExecuteSimulation(THROWN_ERROR.type)}>
                        Thrown Error
                    </EuiButton>
                </EuiFlexItem>

                <EuiFlexItem grow={false}>
                    <EuiButton
                        color="warning"
                        onClick={() =>
                            onExecuteSimulation(CAPTURED_ERROR.type)
                        }>
                        Captured Error
                    </EuiButton>
                </EuiFlexItem>
            </EuiFlexGroup>

            <EuiFlexGroup gutterSize="s" alignItems="center">
                <EuiFlexItem grow={false}>
                    <EuiButton
                        color="text"
                        onClick={() =>
                            onExecuteSimulation(COMPLEX_TRANSACTION.type)
                        }>
                        Complex Transaction
                    </EuiButton>
                </EuiFlexItem>

                <EuiFlexItem grow={false}>
                    <EuiButton
                        color="primary"
                        onClick={() =>
                            onExecuteSimulation(DISTRIBUTED_TRANSACTION.type)
                        }>
                        Distributed Transaction
                    </EuiButton>
                </EuiFlexItem>
            </EuiFlexGroup>
        </>
    );
};

export default SimulatorActions;
