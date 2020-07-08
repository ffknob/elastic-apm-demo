import { useContext, useState, useCallback, useEffect } from 'react';

import User from '../interfaces/User';
import LoginInfo from '../interfaces/LoginInfo';
import BackendError from '../interfaces/BackendError';

import AuthContext from '../context/AuthContext';
import IAuthContext from '../interfaces/AuthContext';

import AuthApi from '../services/api/AuthApi';

const useAuth = (setIsLoading: Function) => {
    const authContext: IAuthContext = useContext(AuthContext);

    const [user, setUser] = useState<User | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    if (!user && !isLoggedIn) {
        const userLocalStorage: string | null = localStorage.getItem('user');

        if (userLocalStorage) {
            let userStored = JSON.parse(userLocalStorage);

            if (
                userStored.token &&
                new Date(userStored.tokenExpirationDate) > new Date()
            ) {
                userStored = JSON.parse(userLocalStorage);

                setUser(userStored);
                setIsLoggedIn(true);

                authContext.setUser(userStored);
                authContext.setIsLoggedIn(true);
            } else {
                console.log('Removing stored user');
                localStorage.removeItem('user');
            }
        }
    }

    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        }
    }, [user]);

    const login = useCallback(
        (loginInfo: LoginInfo): Promise<User> => {
            return new Promise<User>((resolve, reject) => {
                setIsLoading(true);

                AuthApi.login(loginInfo)
                    .then((user: User) => {
                        setIsLoading(false);

                        if (user) {
                            setIsLoggedIn(true);
                            setUser(user);
                            authContext.setUser(user);
                            authContext.setIsLoggedIn(true);
                        }

                        resolve(user);
                    })
                    .catch((err: BackendError<any>) => {
                        setIsLoading(false);

                        reject(err);
                    });
            });
        },
        [authContext, setIsLoading]
    );

    const logout = useCallback((): Promise<User> => {
        return new Promise<User>((resolve, reject) => {
            setIsLoading(true);

            if (user && user.token) {
                AuthApi.logout(user)
                    .then((user: User) => {
                        setIsLoading(false);

                        if (user) {
                            localStorage.removeItem('user');

                            setIsLoggedIn(false);
                            setUser(null);
                            authContext.setIsLoggedIn(false);
                            authContext.setUser(null);
                        }

                        resolve(user);
                    })
                    .catch((err: BackendError<any>) => {
                        setIsLoading(false);

                        reject(err);
                    });
            } else {
                setIsLoading(false);
                reject(new Error('User is not logged in'));
            }
        });
    }, [authContext, setIsLoading, user]);

    return { user, setUser, isLoggedIn, setIsLoggedIn, login, logout };
};

export default useAuth;
