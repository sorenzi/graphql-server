import { IResolverHandler, AuthType } from '../../../middleware';
import { QueryGetUserArgs } from '../../../types/types';
import { errorForType, ErrorType } from '../../../utils/errors';
import * as Joi from 'joi';

import { getUserById, renderUser } from '../utils';

export const handler: IResolverHandler = {
  auth: {
    strategies: [AuthType.JWT]
  },
  validate: {
    id: Joi.string().guid()
  },
  resolver: {
    Query: {
      getUser: async (_: any, args: QueryGetUserArgs) => {
        const { id } = args;
        const user = await getUserById(id);

        if (!user) {
          return errorForType(ErrorType.USER_NOT_FOUND);
        }
        return renderUser(user);
      }
    }
  }
};
