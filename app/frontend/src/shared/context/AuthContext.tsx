import { createContext } from 'react';

import IAuthContext from '../interfaces/AuthContext';
import User from '../interfaces/User';
import LoginInfo from '../interfaces/LoginInfo';

const AuthContext = createContext<IAuthContext>({
  user: null,
  isLoggedIn: false,
  setUser: (user: User | null) => {},
  setIsLoggedIn: (isLoggedIn: boolean) => {},
  login: (loginInfo: LoginInfo): Promise<User> => {
    return new Promise<User>((resolve, reject) => {});
  },
  logout: (): Promise<User> => {
    return new Promise<User>((resolve, reject) => {});
  },
});

export default AuthContext;
