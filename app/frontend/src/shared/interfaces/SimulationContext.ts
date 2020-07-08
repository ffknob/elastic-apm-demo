import Simulation from './Simulation';
import SimulationRequest from './SimulationRequest';
import SimulationType from '../types/SimulationType';

export default interface SimulationContext {
  simulations: Simulation[];
  executeSimulation: (
    simulationType: SimulationType,
    simulationRequest: SimulationRequest
  ) => void;
}
