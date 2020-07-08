import Api from './Api';

import BackendResponse from '../../interfaces/BackendResponse';
import User from '../../interfaces/User';
import LoginInfo from '../../interfaces/LoginInfo';
import LoginResult from '../../interfaces/LoginResult';
import LogoutResult from '../../interfaces/LogoutResult';

export const login = (loginInfo: LoginInfo): Promise<User> => {
    const endpoint = '/users/login';
    return new Promise<User>((resolve, reject) => resolve());
    /*
  return Api.post<BackendResponse<LoginResult>>(endpoint, loginInfo)
    .then(({ data }: any) => {
      if (data.data) {
        return data.data;
      } else {
        throw new Error(
          'An error has occured trying to get logging the user in'
        );
      }
    })
    .catch((err: any) => {
      throw err.response.data;
    });
    */
};

export const logout = (user: User): Promise<User> => {
    const endpoint = '/users/logout';
    return new Promise<User>((resolve, reject) => resolve());
    /*
  return Api.post<BackendResponse<LogoutResult>>(endpoint, null, {
    headers: { Authorization: 'Bearer ' + user.token },
  })
    .then(({ data }: any) => data.data)
    .catch((err: any) => {
      throw err.response.data;
    });
    */
};

export default { login, logout };
