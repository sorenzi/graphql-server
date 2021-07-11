import { getUserById, renderUser } from '../utils';
import { errorForType, ErrorType } from '../shared/errors';
import {
  AuthType,
  ResolverMap,
  resolverWrapper
} from '../../../resolverHandler/validationResolver';

export const resolver: ResolverMap = {
  Query: {
    me: resolverWrapper(
      async (_: any, _args: any, context: any) => {
        const userId = context.user.id;
        const user = await getUserById(userId);

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
