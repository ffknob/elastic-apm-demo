import React from 'react';

import SimulatorForm from './Form/SimulatorForm';

import Simulation from '../../../shared/interfaces/Simulation';

import './Simulator.scss';

export interface SimulatorProps {}

export const SUCCESS: Simulation = {
    type: 'success',
    text: 'Success',
    color: '#23d160'
};

export const THROWN_ERROR: Simulation = {
    type: 'thrown-error',
    text: 'Thrown Error',
    color: '#ff3860'
};
export const CAPTURED_ERROR: Simulation = {
    type: 'captured-error',
    text: 'Captured Error',
    color: '#ffdd57'
};
export const COMPLEX_TRANSACTION: Simulation = {
    type: 'complex-transaction',
    text: 'Complex Transaction',
    color: '#0a0a0a',
    totalSubTransactions: 5,
    totalSpans: 5
};
export const DISTRIBUTED_TRANSACTION: Simulation = {
    type: 'distributed-transaction',
    text: 'Distributed Transaction',
    color: '#3273dc',
    totalSubTransactions: 5,
    totalSpans: 5
};

export const AVAILABLE_SIMULATIONS: Simulation[] = [
    SUCCESS,
    THROWN_ERROR,
    CAPTURED_ERROR,
    COMPLEX_TRANSACTION,
    DISTRIBUTED_TRANSACTION
];

const Simulator: React.FC<SimulatorProps> = (props: SimulatorProps) => {
    return <SimulatorForm />;
};

export default Simulator;
