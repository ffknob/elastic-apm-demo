import React from 'react';

import { EuiPanel } from '@elastic/eui';

import './SimulatorFormCustomContext.scss';

export interface SimulatorFormCustomContextProps {}

const SimulatorFormCustomContext: React.FC<SimulatorFormCustomContextProps> = (
  props: SimulatorFormCustomContextProps
) => {
  return (
    <EuiPanel>
      <h3>Custom context</h3>
    </EuiPanel>
  );
};

export default SimulatorFormCustomContext;
