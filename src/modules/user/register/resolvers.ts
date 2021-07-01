import { ResolverMap } from '../../../types/graphql-utils';

import { createUser, getUserByEmail, renderLoginResponse } from '../utils';
import * as bcrypt from 'bcrypt';
import { MutationRegisterArgs } from '../../../types/types';
import { errorForType, ErrorType } from '../../../utils/errors';
import { schema } from './inputSchema';
import { validateUserInput } from '../../../utils/inputValidationUtil';
import { UserRole } from '../constants';
import { createAccessJWT, createRefreshJWT } from '../../../utils/jwtUtil';

export const resolvers: ResolverMap = {
  Mutation: {
    register: async (_: any, args: MutationRegisterArgs) => {
      validateUserInput(schema, args.payload);

      const { email, password, first_name, last_name, role } = args.payload;
      const hashedPassword = await bcrypt.hash(password, 10);

      const existingUser = await getUserByEmail(email);
      if (existingUser) {
        return errorForType(ErrorType.USER_WITH_EMAIL_EXISTS);
      }

      const userRole: UserRole = <UserRole>role!;

      const payload = {
        password: hashedPassword,
        email,
        role: userRole,
        first_name: first_name || undefined,
        last_name: last_name || undefined
      };

      const user = await createUser(payload);
      const accessJWT = createAccessJWT(user);
      const refreshJWT = createRefreshJWT(user);
      return renderLoginResponse(user, accessJWT, refreshJWT);
    }
  }
};
