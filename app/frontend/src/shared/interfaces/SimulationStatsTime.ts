export default interface SimulationStatsTime {
  start: Date;
  end?: Date;
  took?: number;
  min?: number;
  max?: number;
  avg?: number;
}
