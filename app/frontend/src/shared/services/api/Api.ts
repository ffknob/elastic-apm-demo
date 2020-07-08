import axios, { AxiosRequestConfig } from 'axios';

import Request from '../../interfaces/Request';

import { Config } from '../../config';

const getApiUrl = (endpoint?: string): string => {
  return `${Config.api.protocol}://${Config.api.host}:${Config.api.port}${Config.api.baseUrl}${endpoint}`;
};

export const get = <T>(endpoint: string): Promise<T> => {
  const url = getApiUrl(endpoint);
  return axios.get(url);
};

export const post = <T, U>(request: Request<T, U>): Promise<U> => {
  const url = getApiUrl(request.request.endpoint);
  return axios.post(url, request.request.data, request.request.config);
};

export const _delete = <T>(
  endpoint: string,
  config?: AxiosRequestConfig
): Promise<T> => {
  const url = getApiUrl(endpoint);
  return axios.delete(url, config);
};

export default { get, post, _delete };
