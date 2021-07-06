import Joi = require('joi');
import { AuthType, IResolverHandler } from '../../../middleware';
import { MutationUpdateUserArgs } from '../../../types/types';
import { errorForType, ErrorType } from '../shared/errors';

import { getUserByEmail, getUserById, renderUser, updateUser } from '../utils';
import { schema } from './inputSchema';

export const handler: IResolverHandler = {
  auth: {
    strategies: [AuthType.JWT]
  },
  validate: {
    id: Joi.string().guid(),
    input: schema
  },
  resolver: {
    Mutation: {
      updateUser: async (_: any, args: MutationUpdateUserArgs) => {
        const { id } = args;
        const { input } = args;

        const user = await getUserById(id);
        if (!user) {
          return errorForType(ErrorType.USER_NOT_FOUND);
        }

        // returning an error if we're trying to update a user's email to one that already exists for a different user
        const { email } = input;
        if (email) {
          const existingUser = await getUserByEmail(email);
          if (existingUser) {
            return errorForType(ErrorType.USER_WITH_EMAIL_EXISTS);
          }
        }

        await updateUser(id, input);
        const updatedUser = await getUserById(id);
        if (updatedUser !== undefined) {
          return renderUser(updatedUser);
        }

        return errorForType(ErrorType.USER_NOT_FOUND);
      }
    }
  }
};
