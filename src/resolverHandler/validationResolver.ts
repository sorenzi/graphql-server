import { AuthenticationError, UserInputError } from 'apollo-server-express';
import Joi = require('joi');

export interface ResolverMap {
  [key: string]: {
    [key: string]: (parent: any, args: any, context: {}, info: any) => any;
  };
}

// Supported authentication types
export enum AuthType {
  JWT = 'jwt',
  Session = 'session'
}

// Handler authentication interface, use `scope` to add user role validation
export interface HandlerAuth {
  strategies: AuthType[];
  scope?: string[];
}

// Input validation interface, use this to validate user `input` parameters using `Joi` beyond just type such as validate if string is email or if string is longer/shorter than a given value
export interface InputValidation {
  [key: string]: Joi.ObjectSchema | Joi.Schema;
}

export interface ResolverOptions {
  validate?: InputValidation;
  auth?: HandlerAuth;
}

export const resolverWrapper =
  (next: any, options?: ResolverOptions) =>
    (source: any, args: any, context: any, info: any) => {
      if (!options) {
        return next(source, args, context, info);
      }

      const { validate, auth } = options;
      if (validate) {
        Object.keys(validate).forEach((key) => {
          const schema = validate[key];
          const input = args[key];
          const error = validateUserInput(schema, input);
          if (error) {
            throw error;
          }
        });
      }

      // If an authorization strategy was set in the handler use it to validate the
      // JWT authorization header token and also validate the user scope (role) if applicable
      if (auth) {
      // valid auth jwt tokens should update the context object on the apollo server middleware we created in server.ts
        const { user } = context;
        if (!user) {
          throw new AuthenticationError('Unauthenticated!');
        }

        const { scope } = auth;
        if (scope) {
          if (!user.role || !scope.includes(user.role)) {
            throw new AuthenticationError('Insufficient scope');
          }
        }
      }
      return next(source, args, context, info);
    };

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
