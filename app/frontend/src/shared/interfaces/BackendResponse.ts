import BackendResponseMetadata from './BackendResponseMetadata';

export default interface BackendResponse<T> {
    id?: string;
    success: boolean;
    statusCode: number;
    statusMessage: string;
    metadata?: BackendResponseMetadata;
    body?: T;
}
