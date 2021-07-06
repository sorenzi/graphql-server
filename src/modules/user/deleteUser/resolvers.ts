import Joi = require('joi');
import { IResolverHandler, AuthType } from '../../../middleware';
import { MutationDeleteUserArgs } from '../../../types/types';
import { errorForType, ErrorType } from '../shared/errors';
import { UserRole } from '../constants';

import { deleteUser, getUserById } from '../utils';

export const handler: IResolverHandler = {
  auth: {
    strategies: [AuthType.JWT],
    // Only admins are allowed to delete a user
    scope: [UserRole.ADMIN]
  },
  validate: {
    id: Joi.string().guid()
  },
  resolver: {
    Mutation: {
      deleteUser: async (_: any, args: MutationDeleteUserArgs) => {
        const { id } = args;
        const user = await getUserById(id);

        if (!user) {
          return errorForType(ErrorType.USER_NOT_FOUND);
        }

        await deleteUser(id);

        // TODO: move to shared util file
        return {
          __typename: 'ObjectDeleteResult',
          success: true
        };
      }
    }
  }
};
