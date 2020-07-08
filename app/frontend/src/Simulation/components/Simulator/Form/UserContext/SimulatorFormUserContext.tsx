import React, { useState } from 'react';

import {
  EuiPanel,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormFieldset,
  EuiFieldText,
} from '@elastic/eui';

import './SimulatorFormUserContext.scss';

export interface SimulatorFormUserContextProps {}

const ID = 12345456789;
const USERNAME = 'johndoe';
const EMAIL = 'johndoe@nowhere.com';

const SimulatorFormUserContext: React.FC<SimulatorFormUserContextProps> = (
  props: SimulatorFormUserContextProps
) => {
  const [id, setId] = useState<number | string>(ID);
  const [username, setUsername] = useState<number | string>(USERNAME);
  const [email, setEmail] = useState<number | string>(EMAIL);

  return (
    <EuiPanel>
      <h3>User context</h3>

      <EuiFlexGroup direction="column">
        <EuiFlexItem>
          <EuiFormFieldset legend={{ children: 'Id' }}>
            <EuiFieldText
              icon="number"
              value={id}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setId(e.target.value)
              }
              aria-label="Id"
            />
          </EuiFormFieldset>
        </EuiFlexItem>

        <EuiFlexItem>
          <EuiFormFieldset legend={{ children: 'Username' }}>
            <EuiFieldText
              icon="user"
              value={username}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setUsername(e.target.value)
              }
              aria-label="Username"
            />
          </EuiFormFieldset>
        </EuiFlexItem>

        <EuiFlexItem>
          <EuiFormFieldset legend={{ children: 'E-mail' }}>
            <EuiFieldText
              icon="email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              aria-label="E-mail"
            />
          </EuiFormFieldset>
        </EuiFlexItem>
      </EuiFlexGroup>
    </EuiPanel>
  );
};

export default SimulatorFormUserContext;
