import SimulationParameters from './SimulationParameters';
import SimulationOptions from './SimulationOptions';

export default interface SimulationRequest {
  parameters: SimulationParameters;
  options: SimulationOptions;
  complexTransaction?: {
    totalSubTransactions: number;
    totalSpans: number;
  };
  distributedTransaction?: {
    totalSubTransactions: number;
    totalSpans: number;
  };
}
