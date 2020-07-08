import CustomContext from './custom-context';
import UserContext from './user-context';
import Label from './label';

export default interface SimulationRequest {
  maxRandomDelay: number;
  randomUserContext: boolean;
  userContext: UserContext;
  randomCustomContext: boolean;
  customContext: CustomContext;
  randomLabels: boolean;
  labels: Label[];
  complexTransaction: boolean;
  distributedTransaction: boolean;
}
