import React, { useState, useEffect, useCallback } from 'react';

import { EuiPanel, EuiSpacer, EuiFlexGroup, EuiFlexItem } from '@elastic/eui';

import SimulatorFormLabelsTable from './Table/SimulatorFormLabelsTable';
import SimulatorFormLabelsControls from './Controls/SimulatorFormLabelsControls';

import APMLabel from '../../../../../shared/interfaces/APMLabel';

import './SimulatorFormLabels';

export interface SimulatorFormLabelsProps {
  onLabelsChanged?: (labels: APMLabel[]) => void;
}

const LABELS: APMLabel[] = [
  { key: 'environment', value: 'Production' },
  { key: 'cloud-provider', value: 'AWS' },
  { key: 'currency', value: 'EUR' },
  { key: 'important', value: 'true' },
  { key: 'retry', value: 'false' },
];

const SimulatorFormLabels: React.FC<SimulatorFormLabelsProps> = (
  props: SimulatorFormLabelsProps
) => {
  const { onLabelsChanged } = props;

  const [labels, setLabels] = useState<APMLabel[]>(LABELS);
  const [copiedLabel, setCopiedLabel] = useState<APMLabel | null>(null);
  const [selectedLabels, setSelectedLabels] = useState<APMLabel[]>([]);

  // useEffect(() => {
  //   if (onLabelsChanged) {
  //     onLabelsChanged(LABELS);
  //   }
  // }, [onLabelsChanged]);

  useCallback(() => {
    if (onLabelsChanged) {
      onLabelsChanged(labels);
    }
  }, [onLabelsChanged, labels]);

  const addLabel = (newLabel: APMLabel) => {
    labels.push(newLabel);
    setLabels(labels);
  };

  const copyLabel = (label: APMLabel) => {
    setCopiedLabel(label);
  };

  const removeLabels = (selectedLabels: APMLabel[] | APMLabel) => {
    const newLabels: APMLabel[] = labels?.filter((label: APMLabel) => {
      return selectedLabels instanceof Array
        ? selectedLabels.indexOf(label) < 0
        : label !== selectedLabels;
    });

    setLabels(newLabels);
    setSelectedLabels([]);
  };

  const checkLabelExists = (key: string): boolean => {
    return labels.filter((label: APMLabel) => label.key === key).length > 0;
  };

  return (
    <EuiPanel>
      <h3>Labels</h3>

      <EuiSpacer size="m" />

      <EuiFlexGroup direction="column">
        <EuiFlexItem>
          <SimulatorFormLabelsControls
            copiedLabel={copiedLabel}
            selectedLabels={selectedLabels}
            checkLabelExists={checkLabelExists}
            onAddLabel={addLabel}
            removeLabels={removeLabels}
          />
        </EuiFlexItem>

        <EuiFlexItem style={{ width: 400 }}>
          <SimulatorFormLabelsTable
            labels={labels}
            onSelectedLabelsChange={(selectedLabels: APMLabel[]) =>
              setSelectedLabels(selectedLabels)
            }
            onCopyLabel={copyLabel}
            onRemoveLabel={removeLabels}
          />
        </EuiFlexItem>
      </EuiFlexGroup>
    </EuiPanel>
  );
};

export default SimulatorFormLabels;
