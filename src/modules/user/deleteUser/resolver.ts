import {
  AuthType,
  ResolverMap,
  resolverWrapper
} from '../../../resolverHandler/validationResolver';

import { MutationDeleteUserArgs } from '../../../types/types';
import { errorForType, ErrorType } from '../shared/errors';
import Joi = require('joi');

import { deleteUser, getUserById } from '../utils';
import { UserRole } from '../constants';

export const resolver: ResolverMap = {
  Mutation: {
    deleteUser: resolverWrapper(
      async (_: any, args: MutationDeleteUserArgs) => {
        const { id } = args;
        const user = await getUserById(id);

        if (!user) {
          throw errorForType(ErrorType.USER_NOT_FOUND);
        }

        await deleteUser(id);

        // TODO: move to shared util file
        return {
          __typename: 'ObjectDeleteResult',
          success: true
        };
      },
      {
        auth: {
          strategies: [AuthType.JWT],
          // Only admins are allowed to delete a user
          scope: [UserRole.ADMIN]
        },
        validate: {
          id: Joi.string().guid()
        }
      }
    )
  }
};
