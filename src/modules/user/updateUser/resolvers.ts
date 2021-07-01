import Joi = require('joi');
import { ResolverMap } from '../../../types/graphql-utils';
import { MutationUpdateUserArgs } from '../../../types/types';
import { errorForType, ErrorType } from '../../../utils/errors';
import { validateUserInput } from '../../../utils/inputValidationUtil';

import { getUserByEmail, getUserById, renderUser, updateUser } from '../utils';
import { schema } from './inputSchema';

export const resolvers: ResolverMap = {
  Mutation: {
    updateUser: async (_: any, args: MutationUpdateUserArgs) => {
      validateUserInput(schema, args.payload);

      const { id, payload } = args;
      const idSchema = Joi.object({
        id: Joi.string().guid()
      });
      validateUserInput(idSchema, { id });

      const user = await getUserById(id);
      if (!user) {
        return errorForType(ErrorType.USER_NOT_FOUND);
      }

      // returning an error if we're trying to update a user's email to one that already exists for a different user
      const { email } = payload;
      if (email) {
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
          return errorForType(ErrorType.USER_WITH_EMAIL_EXISTS);
        }
      }

      await updateUser(id, payload);
      const updatedUser = await getUserById(id);
      if (updatedUser !== undefined) {
        return renderUser(updatedUser);
      }

      return errorForType(ErrorType.USER_NOT_FOUND);
    }
  }
};
