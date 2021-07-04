// Validating the user input against a joi schema
import Joi = require('joi');
import { UserInputError } from 'apollo-server-express';

export const validateUserInput = (
  schema: Joi.ObjectSchema<any> | Joi.Schema,
  payload: any
) => {
  const { error } = schema.validate(payload, { abortEarly: false });
  if (error) {
    let validationErrors = {};
    // We only want to expose our api implementation in a non prod environment
    if (process.env.NODE_ENV !== 'production') {
      validationErrors = error.details;
    }

    return new UserInputError('Invalid user input', {
      validationErrors
    });
  }
  return null;
};
