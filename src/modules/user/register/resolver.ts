import { createUser, getUserByEmail, renderLoginResponse } from '../utils';
import * as bcrypt from 'bcrypt';
import { MutationRegisterArgs } from '../../../types/types';
import { errorForType, ErrorType } from '../shared/errors';
import { schema } from './inputSchema';
import { UserRole } from '../constants';
import { createAccessJWT, createRefreshJWT } from '../../../utils/jwtUtil';
import {
  ResolverMap,
  resolverWrapper
} from '../../../resolverHandler/validationResolver';

export const resolver: ResolverMap = {
  Mutation: {
    register: resolverWrapper(
      async (_: any, args: MutationRegisterArgs) => {
        const { email, password, first_name, last_name, role } = args.input;
        const hashedPassword = await bcrypt.hash(password, 10);

        const existingUser = await getUserByEmail(email);
        if (existingUser) {
          throw errorForType(ErrorType.USER_WITH_EMAIL_EXISTS);
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
      },
      {
        validate: {
          input: schema
        }
      }
    )
  }
};
