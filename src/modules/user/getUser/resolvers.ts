import { ResolverMap } from '../../../types/graphql-utils';
import { QueryGetUserArgs } from '../../../types/types';
import { errorForType, ErrorType } from '../../../utils/errors';
import { validateUserInput } from '../../../utils/inputValidationUtil';

import { getUserById, renderUser } from '../utils';
import { schema } from './inputSchema';

export const resolvers: ResolverMap = {
  Query: {
    getUser: async (_: any, args: QueryGetUserArgs) => {
      validateUserInput(schema, args);

      const { id } = args;
      const user = await getUserById(id);

      if (!user) {
        return errorForType(ErrorType.USER_NOT_FOUND);
      }
      return renderUser(user);
    }
  }
};
