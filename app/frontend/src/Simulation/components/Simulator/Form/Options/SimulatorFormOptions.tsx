import React, { useState } from 'react';

import { EuiSpacer, EuiFormRow, EuiSwitch, EuiSwitchEvent } from '@elastic/eui';

import SimulatorFormUserContext from '../UserContext/SimulatorFormUserContext';
import SimulatorFormCustomContext from '../CustomContext/SimulatorFormCustomContext';
import SimulatorFormLabels from '../Labels/SimulatorFormLabels';

import SimulationOptions from '../../../../../shared/interfaces/SimulationOptions';
import APMLabel from '../../../../../shared/interfaces/APMLabel';

import './SimulatorFormOptions.scss';

export interface SimulatorFormOptionsProps {
  simulatorFormOptions: SimulationOptions;
  onSimulatorFormOptionsChanged?: (
    SimulatorFormOptions: SimulationOptions
  ) => void;
}

const SimulatorFormOptions: React.FC<SimulatorFormOptionsProps> = (
  props: SimulatorFormOptionsProps
) => {
  const { simulatorFormOptions, onSimulatorFormOptionsChanged } = props;

  const [randomUserContext, setRandomUserContext] = useState<boolean>(
    simulatorFormOptions.randomUserContext || true
  );
  const [randomCustomContext, setRandomCustomContext] = useState<boolean>(
    simulatorFormOptions.randomCustomContext || true
  );
  const [randomLabels, setRandomLabels] = useState<boolean>(
    simulatorFormOptions.randomLabels || true
  );

  const simulatorFormOptionsChanged = (parameter: any, value: any) => {
    const _simulatorFormOptions: SimulationOptions = {
      ...simulatorFormOptions,
      [parameter]: value,
    };

    if (onSimulatorFormOptionsChanged) {
      onSimulatorFormOptionsChanged(_simulatorFormOptions);
    }
  };

  return (
    <>
      <h2>Options</h2>

      <EuiSpacer size="m" />

      <EuiFormRow hasChildLabel={false}>
        <EuiSwitch
          name="swiset-random-user-contexttch"
          label="Set random user context"
          checked={randomUserContext}
          onChange={(e: EuiSwitchEvent) => {
            const value = e.target.checked;
            setRandomUserContext(value);
            simulatorFormOptionsChanged('randomUserContext', value);
          }}
        />
      </EuiFormRow>

      {!randomUserContext && (
        <>
          <EuiSpacer size="m" />
          <SimulatorFormUserContext />
          <EuiSpacer size="m" />
        </>
      )}

      <EuiFormRow hasChildLabel={false}>
        <EuiSwitch
          name="set-random-custom-context"
          label="Set random custom context"
          checked={randomCustomContext}
          onChange={(e: EuiSwitchEvent) => {
            const value = e.target.checked;
            setRandomCustomContext(value);
            simulatorFormOptionsChanged('randomCustomContext', value);
          }}
        />
      </EuiFormRow>

      {!randomCustomContext && (
        <>
          <EuiSpacer size="m" />
          <SimulatorFormCustomContext />
        </>
      )}

      <EuiFormRow hasChildLabel={false}>
        <EuiSwitch
          name="set-random-labels"
          label="Set random labels"
          checked={randomLabels}
          onChange={(e: EuiSwitchEvent) => {
            const value = e.target.checked;
            setRandomLabels(value);
            simulatorFormOptionsChanged('randomLabels', value);
          }}
        />
      </EuiFormRow>

      {!randomLabels && (
        <>
          <EuiSpacer size="m" />
          <SimulatorFormLabels
            onLabelsChanged={(labels: APMLabel[]) => {
              simulatorFormOptionsChanged('labels', labels);
            }}
          />
          <EuiSpacer size="m" />
        </>
      )}
    </>
  );
};

export default SimulatorFormOptions;
