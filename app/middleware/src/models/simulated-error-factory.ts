import SimulatedError from './simulated-error';

export default abstract class SimulatedErrorFactory {
  abstract category: string;

  abstract generate: () => SimulatedError;
}
