import { getUserByEmail, renderLoginResponse } from '../utils';
import * as bcrypt from 'bcrypt';
import { QueryLoginArgs } from '../../../types/types';
import { errorForType, ErrorType } from '../shared/errors';
import { schema } from './inputSchema';
import { createAccessJWT, createRefreshJWT } from '../../../utils/jwtUtil';
import {
  ResolverMap,
  resolverWrapper
} from '../../../resolverHandler/validationResolver';

export const resolver: ResolverMap = {
  Query: {
    login: resolverWrapper(
      async (_: any, args: QueryLoginArgs) => {
        const { email, password } = args.input;
        const user = await getUserByEmail(email);
        if (!user) {
          // Returning an ambiguous response on purpose to not expose if we have a user with this email or not since this is an unprotected endpoint.
          throw errorForType(ErrorType.WRONG_EMAIL_OR_PASSWORD);
        }
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
          throw errorForType(ErrorType.WRONG_EMAIL_OR_PASSWORD);
        }

        const accessJWT = createAccessJWT(user);
        const refreshJWT = createRefreshJWT(user);
        const response = renderLoginResponse(user, accessJWT, refreshJWT);
        return response;
      },
      {
        validate: {
          input: schema
        }
      }
    )
  }
};
