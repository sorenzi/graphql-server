import { ResolverMap } from '../../../types/graphql-utils';
import { MutationDeleteUserArgs } from '../../../types/types';
import { errorForType, ErrorType } from '../../../utils/errors';
import { validateUserInput } from '../../../utils/inputValidationUtil';
import { schema } from '../getUser/inputSchema';

import { deleteUser, getUserById } from '../utils';

export const resolvers: ResolverMap = {
  Mutation: {
    deleteUser: async (_: any, args: MutationDeleteUserArgs) => {
      validateUserInput(schema, args);

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
};
