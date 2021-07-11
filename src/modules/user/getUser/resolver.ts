import {
  AuthType,
  ResolverMap,
  resolverWrapper
} from '../../../resolverHandler/validationResolver';

import { QueryGetUserArgs } from '../../../types/types';
import { errorForType, ErrorType } from '../shared/errors';

import { getUserById, renderUser } from '../utils';

export const resolver: ResolverMap = {
  Query: {
    getUser: resolverWrapper(
      async (_: any, args: QueryGetUserArgs) => {
        const { id } = args;
        const user = await getUserById(id);

        if (!user) {
          throw errorForType(ErrorType.USER_NOT_FOUND);
        }
        return renderUser(user);
      },
      {
        auth: {
          strategies: [AuthType.JWT]
        }
      }
    )
  }
};
