import SimulationStatsTime from './SimulationStatsTime';

export default interface SimulationStats {
  total?: number;
  sent?: number;
  completed?: number;
  timedOut?: number;
  time?: SimulationStatsTime;
}
