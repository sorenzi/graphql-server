import Joi = require('joi');
import gql from 'graphql-tag';

import { validateJWTAuth } from './authUtil';

import {
  extractIdentifier,
  extractInput,
  generateHandlersMap,
  validateUserInput
} from './gqlUtils';

export interface ResolverMap {
  [key: string]: {
    [key: string]: (parent: any, args: any, context: {}, info: any) => any;
  };
}

export enum AuthType {
  JWT = 'jwt',
  Session = 'session'
}

export interface ResolverAuth {
  strategies: AuthType[];
  scope?: string[];
}

export interface InputValidation {
  [key: string]: Joi.ObjectSchema | Joi.Schema;
}

export interface IResolverHandler {
  auth?: ResolverAuth;
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

    const parsedQuery = gql`
      ${query}
    `;
    const handlerIdentifier = extractIdentifier(parsedQuery);
    if (!handlerIdentifier) {
      return;
    }

    const handler = handlersMap[handlerIdentifier];
    if (!handler) {
      return;
    }

    let context = {};
    const { auth, validate } = handler;
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
