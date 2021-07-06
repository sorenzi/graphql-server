import { IResolverHandler, AuthType } from '../../../middleware';
import { errorForType, ErrorType } from '../shared/errors';

import { getUserById, renderUser } from '../utils';

export const handler: IResolverHandler = {
  auth: {
    strategies: [AuthType.JWT]
  },
  resolver: {
    Query: {
      me: async (_: any, _args: any, context: any) => {
        const userId = context.user.id;
        const user = await getUserById(userId);

        if (!user) {
          return errorForType(ErrorType.USER_NOT_FOUND);
        }
        return renderUser(user);
      }
    }
  }
};
