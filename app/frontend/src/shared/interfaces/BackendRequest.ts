import { Method, AxiosRequestConfig } from 'axios';

export default interface BackendRequest<T> {
  method: Method;
  endpoint: string;
  data?: T;
  config?: AxiosRequestConfig;
}
