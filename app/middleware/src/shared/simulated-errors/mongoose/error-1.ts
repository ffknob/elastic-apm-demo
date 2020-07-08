import SimulatedError from '../../../models/simulated-error';
import SimulatedErrorFactory from '../../../models/simulated-error-factory';

const CATEGORY: string = 'mongoose';
const STATUS_CODE: number = 500;
const ERROR_MESSAGE: string =
  'Mongoose could not convert a value to the type defined in the schema path. May be in a `ValidationError` class `errors` property.';

export default class _ extends SimulatedErrorFactory {
  category: string = CATEGORY;

  generate = () => {
    const error: SimulatedError = {
      name: 'Simulated Error: Mongoose',
      category: CATEGORY,
      statusCode: STATUS_CODE,
      message: ERROR_MESSAGE,
    };

    return error;
  };
}
