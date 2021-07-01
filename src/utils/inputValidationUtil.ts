import { UserInputError } from 'apollo-server';
import * as Joi from 'joi';

export const validateUserInput = (
  schema: Joi.ObjectSchema<any>,
  payload: any
) => {
  const { error } = schema.validate(payload, { abortEarly: false });
  if (error) {
    let validationErrors = {};
    // We only want to expose our api implementation in a non prod environment
    if (process.env.NODE_ENV !== 'production') {
      validationErrors = error.details;
    }

    throw new UserInputError('Invalid user input', {
      validationErrors
    });
  }
};
