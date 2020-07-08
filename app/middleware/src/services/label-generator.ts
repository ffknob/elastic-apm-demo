const LABELS = [
  {
    name: 'environment',
    values: ['Development', 'Testing', 'Staging', 'Production'],
  },
  {
    name: 'cloud-provider',
    values: ['AWS', 'GCP', 'Azure', 'Digital Ocean'],
  },
  { name: 'currency', values: ['USD', 'EUR', 'GBP', 'BRL'] },
  { name: 'important', values: ['Yes', 'No'] },
  { name: 'retry', values: ['Yes', 'No'] },
];

class LabelGenerator {
  constructor() {}

  getRandomLabel() {
    const labels = LABELS;
    const randomLabelIndex = Math.floor(Math.random() * labels.length);
    const randomLabel = labels[randomLabelIndex];

    const labelValues = randomLabel.values;
    const randomLabelValueIndex = Math.floor(
      Math.random() * labelValues.length
    );

    return {
      name: randomLabel.name,
      value: labelValues[randomLabelValueIndex],
    };
  }
}

export default LabelGenerator;
