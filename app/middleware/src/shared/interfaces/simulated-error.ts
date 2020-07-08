export default interface SimulatedError extends Error {
  statusCode: number;
  category: string;
}
