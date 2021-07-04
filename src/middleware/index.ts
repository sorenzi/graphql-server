// This is middleware will add a layer of user authentication and authorization
// and input payload validation using Joi. Adding authentication and validation is optional
// and may vary depending on your needs in the resolver handler implementation
import Joi = require('joi');
import gql from 'graphql-tag';

import { validateJWTAuth } from './authUtil';

import {
  extractIdentifier,
  extractInput,
  generateHandlersMap
} from './gqlUtils';
import { validateUserInput } from './inputValidationUtil';

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

// Resolver handler interface
export interface IResolverHandler {
  auth?: HandlerAuth;
  validate?: InputValidation;
  resolver: ResolverMap;
}

export interface ResolverHandlerMap {
  [key: string]: IResolverHandler;
}

export default (handlers: IResolverHandler[], secret: string) => {
  if (!handlers) throw new Error('Resolver Handlers should be set');

  const handlersMap = generateHandlersMap(handlers);
  const jwtSecret = secret;

  const middleware = ({ req }: any) => {
    const { query, variables } = req.body;

    if (!query) {
      return;
    }

    // parsing the gql portion of the request into workable json
    const parsedQuery = gql`
      ${query}
    `;
    const handlerIdentifier = extractIdentifier(parsedQuery);
    if (!handlerIdentifier) {
      return;
    }

    // getting the registered handler for this request identifier
    const handler = handlersMap[handlerIdentifier];
    if (!handler) {
      return;
    }

    let context = {};
    const { auth, validate } = handler;
    // If a validate object was set in the handler validate the request user input with the given Joi schema
    if (validate && variables) {
      Object.keys(validate).forEach((key) => {
        const schema = validate[key];
        const input = extractInput(parsedQuery, key, variables);
        const error = validateUserInput(schema, input);
        if (error) {
          throw error;
        }
      });
    }

    // If an authorization strategy was set in the handler use it to validate the
    // JWT authorization header token and also validate the user scope (role) if applicable
    if (auth) {
      const { strategies, scope } = auth;
      strategies.forEach((strategy) => {
        switch (strategy) {
          case AuthType.JWT:
            context = validateJWTAuth(req, jwtSecret, scope);
            break;
          case AuthType.Session:
            // TODO: add session (cookies) validation
            break;

          default:
            break;
        }
      });
    }
    return context;
  };
  return middleware;
};
