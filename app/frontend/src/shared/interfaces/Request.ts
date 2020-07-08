import { Observable } from 'rxjs';
import BackendRequest from './BackendRequest';
import BackendRequestTime from './BackendRequestTime';
import BackendResponse from './BackendResponse';

export default interface Request<T, U> {
    id: string;
    request: BackendRequest<T>;
    response?: BackendResponse<U>;
    response$?: Observable<BackendResponse<U>>;
    time: BackendRequestTime;
}
