import { createContext } from 'react';

import IAuthContext from '../interfaces/AuthContext';
import User from '../interfaces/User';
import LoginInfo from '../interfaces/LoginInfo';

const AuthContext = createContext<IAuthContext>({
    user: null,
    isSignedIn: false,
    setUser: (user: User | null) => {},
    setIsSignedIn: (isSignedIn: boolean) => {},
    signIn: (loginInfo: LoginInfo): Promise<User> => {
        return new Promise<User>((resolve, reject) => {});
    },
    signOut: (): Promise<User> => {
        return new Promise<User>((resolve, reject) => {});
    }
});

export default AuthContext;
