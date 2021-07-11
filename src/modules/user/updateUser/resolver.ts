import {
  AuthType,
  ResolverMap,
  resolverWrapper
} from '../../../resolverHandler/validationResolver';

import { MutationUpdateUserArgs } from '../../../types/types';
import { errorForType, ErrorType } from '../shared/errors';
import Joi = require('joi');
import { schema } from './inputSchema';

import { getUserByEmail, getUserById, renderUser, updateUser } from '../utils';
import { UserRole } from '../constants';

export const resolver: ResolverMap = {
  Mutation: {
    updateUser: resolverWrapper(
      async (_: any, args: MutationUpdateUserArgs) => {
        const { id } = args;
        const { input } = args;

        const user = await getUserById(id);
        if (!user) {
          throw errorForType(ErrorType.USER_NOT_FOUND);
        }

        // returning an error if we're trying to update a user's email to one that already exists for a different user
        const { email } = input;
        if (email) {
          const existingUser = await getUserByEmail(email);
          if (existingUser) {
            throw errorForType(ErrorType.USER_WITH_EMAIL_EXISTS);
          }
        }

        await updateUser(id, input);
        const updatedUser = await getUserById(id);
        if (!updatedUser) {
          throw errorForType(ErrorType.USER_NOT_FOUND);
        }
        return renderUser(updatedUser);
      },
      {
        auth: {
          strategies: [AuthType.JWT],
          scope: [UserRole.ADMIN]
        },
        validate: {
          id: Joi.string().guid(),
          input: schema
        }
      }
    )
  }
};
