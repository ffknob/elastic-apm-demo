import React from 'react';
import { useHistory } from 'react-router';

import { EuiText, EuiLink } from '@elastic/eui';

import { Page } from '../../shared/components/Page';

import './Home.scss';

const Home: React.FC = () => {
  const history = useHistory();

  return (
    <Page pageTitle="Welcome">
      <EuiText>
        <EuiLink onClick={() => history.push('/simulate')}>Simulate</EuiLink>
      </EuiText>
    </Page>
  );
};

export default Home;
