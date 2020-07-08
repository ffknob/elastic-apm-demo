import { createContext } from 'react';

import IAppContext from '../interfaces/AppContext';

const AppContext = createContext<IAppContext>({
  isLoading: false,
  loading: (isLoading: boolean) => {},
});

export default AppContext;
