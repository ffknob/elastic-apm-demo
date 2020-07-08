type SimulationType =
  | 'success'
  | 'thrown-error'
  | 'captured-error'
  | 'complex-transaction'
  | 'distributed-transaction';

export default SimulationType;
