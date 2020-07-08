export default interface BackendError extends Error {
    statusCode: number;
    category: string;
    message: string;
}
