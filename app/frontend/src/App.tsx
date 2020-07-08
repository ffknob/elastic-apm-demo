import React, { useState, useCallback } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';

import { EuiFlexGroup, EuiFlexItem } from '@elastic/eui';

import { Header } from './shared/components/Header';
import { Body } from './shared/components/Body';
import { Footer } from './shared/components/Footer';
import { Home } from './Home/pages';

import Simulation from './Simulation/pages/Simulation';

import AppContext from './shared/context/AppContext';
import AuthContext from './shared/context/AuthContext';

import useAuth from './shared/hooks/auth';

import './App.scss';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { user, setUser, isLoggedIn, setIsLoggedIn, login, logout } = useAuth(
    setIsLoading
  );

  const loading = useCallback((isLoading: boolean) => {
    setIsLoading(isLoading);
  }, []);

  return (
    <React.Fragment>
      <AppContext.Provider
        value={{
          isLoading,
          loading,
        }}>
        <AuthContext.Provider
          value={{
            user,
            isLoggedIn,
            setUser,
            setIsLoggedIn,
            login,
            logout,
          }}>
          <Router>
            <EuiFlexGroup direction="column">
              <EuiFlexItem grow={false}>
                <Header />
              </EuiFlexItem>
              <EuiFlexItem>
                <Switch>
                  <Body>
                    <Route path="/" exact>
                      <Home />
                    </Route>
                    <Route path="/simulate" exact>
                      <Simulation />
                    </Route>
                    <Route path="/b" exact>
                      <div>B</div>
                    </Route>
                    <Route path="/auth" exact>
                      <div>Auth</div>
                    </Route>
                    <Redirect to="/" />
                  </Body>
                </Switch>
              </EuiFlexItem>
              <EuiFlexItem grow={false}>
                <Footer />
              </EuiFlexItem>
            </EuiFlexGroup>
          </Router>
        </AuthContext.Provider>
      </AppContext.Provider>
    </React.Fragment>
  );
};

export default App;
