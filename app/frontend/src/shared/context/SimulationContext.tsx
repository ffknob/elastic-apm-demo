import { createContext } from 'react';

import ISimulationContext from '../interfaces/SimulationContext';
import SimulationRequest from '../interfaces/SimulationRequest';

import SimulationType from '../types/SimulationType';

const SimulationContext = createContext<ISimulationContext>({
  simulations: [],
  executeSimulation: (
    simulationType: SimulationType,
    simulationRequest: SimulationRequest
  ) => {},
});

export default SimulationContext;
