import React, { useState, useEffect } from 'react';

import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormRow,
  EuiFieldText,
  EuiButton,
} from '@elastic/eui';

import APMLabel from '../../../../../../shared/interfaces/APMLabel';

import './SimulatorFormLabelsControls.scss';

export interface SimulatorFormLabelsControlsProps {
  copiedLabel?: APMLabel | null;
  selectedLabels?: APMLabel[] | null;
  checkLabelExists: (key: string) => boolean;
  onAddLabel: (label: APMLabel) => void;
  removeLabels: (selectedLabels: APMLabel[]) => void;
}

interface FieldError {
  isInvalid: boolean;
  message?: string;
}

interface AddLabelFieldsErrors {
  key: FieldError;
  value: FieldError;
}

const SimulatorFormLabelsControls: React.FC<SimulatorFormLabelsControlsProps> = (
  props: SimulatorFormLabelsControlsProps
) => {
  const {
    copiedLabel,
    selectedLabels,
    checkLabelExists,
    onAddLabel,
    removeLabels,
  } = props;

  const [key, setKey] = useState<string>(copiedLabel ? copiedLabel.key : '');
  const [value, setValue] = useState<string>(
    copiedLabel ? copiedLabel.value : ''
  );

  const [errors, setErrors] = useState<AddLabelFieldsErrors>({
    key: { isInvalid: false },
    value: { isInvalid: false },
  });

  useEffect(() => {
    if (copiedLabel) {
      setKey(copiedLabel.key);
      setValue(copiedLabel.value);
    }
  }, [copiedLabel]);

  const disableRemoveButton: boolean = selectedLabels
    ? selectedLabels.length === 0
    : true;

  const validateAddLabel = (): boolean => {
    let hasErrors: boolean = false;
    const _errors: AddLabelFieldsErrors = {
      key: { isInvalid: false },
      value: { isInvalid: false },
    };

    if (key === '') {
      _errors.key.isInvalid = true;
      _errors.key.message = 'Please inform a key';

      hasErrors = true;
    } else {
      if (checkLabelExists(key)) {
        _errors.key.isInvalid = true;
        _errors.key.message = 'Label already exists';

        hasErrors = true;
      }
    }

    if (value === '') {
      _errors.value.isInvalid = true;
      _errors.value.message = 'Please inform a value';

      hasErrors = true;
    }

    setErrors(_errors);

    return !hasErrors;
  };

  const addLabel = () => {
    if (validateAddLabel()) {
      setKey('');
      setValue('');

      onAddLabel({ key: key, value: value });
    }
  };

  return (
    <EuiFlexGroup direction="column">
      <EuiFlexItem>
        <EuiFormRow
          label="Key"
          helpText="The key of the new label."
          isInvalid={errors.key.isInvalid}
          error={errors.key.message}>
          <EuiFieldText
            icon="tag"
            value={key}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setKey(e.target.value)
            }
            aria-label="Key"
          />
        </EuiFormRow>
      </EuiFlexItem>
      <EuiFlexItem>
        <EuiFormRow
          label="Value"
          helpText="The value of the new label."
          isInvalid={errors.value.isInvalid}
          error={errors.value.message}>
          <EuiFieldText
            icon="string"
            value={value}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setValue(e.target.value)
            }
            aria-label="Value"
          />
        </EuiFormRow>
      </EuiFlexItem>

      <EuiFlexItem>
        <EuiFlexGroup direction="row">
          <EuiFlexItem>
            <EuiFormRow>
              <EuiButton fill onClick={() => addLabel()} iconType="listAdd">
                Add
              </EuiButton>
            </EuiFormRow>
          </EuiFlexItem>

          <EuiFlexItem>
            <EuiFormRow>
              <EuiButton
                fill
                color="danger"
                isDisabled={disableRemoveButton}
                onClick={() =>
                  selectedLabels ? removeLabels(selectedLabels) : null
                }
                iconType="trash">
                {!disableRemoveButton
                  ? `Remove ${selectedLabels!.length || 0} ${
                      selectedLabels!.length > 1 ? 'labels' : 'label'
                    }`
                  : `Select labels to remove`}
              </EuiButton>
            </EuiFormRow>
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiFlexItem>
    </EuiFlexGroup>
  );
};

export default SimulatorFormLabelsControls;
