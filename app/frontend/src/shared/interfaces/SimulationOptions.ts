import APMUserContext from './APMUserContext';
import APMCustomContext from './APMCustomContext';
import APMLabel from './APMLabel';

export default interface SimulationOptions {
  randomUserContext: boolean;
  userContext?: APMUserContext;
  randomCustomContext: boolean;
  customContext?: APMCustomContext;
  randomLabels: boolean;
  labels?: APMLabel[];
}
