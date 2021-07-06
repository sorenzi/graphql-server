import { IResolverHandler } from '../../../middleware';

import { getUserByEmail, renderLoginResponse } from '../utils';
import * as bcrypt from 'bcrypt';
import { QueryLoginArgs } from '../../../types/types';
import { errorForType, ErrorType } from '../shared/errors';
import { schema } from './inputSchema';
import { createAccessJWT, createRefreshJWT } from '../../../utils/jwtUtil';

export const handler: IResolverHandler = {
  validate: {
    input: schema
  },
  resolver: {
    Query: {
      login: async (_: any, args: QueryLoginArgs) => {
        const { email, password } = args.input;
        const user = await getUserByEmail(email);
        if (!user) {
          // Returning an ambiguous response on purpose to not expose if we have a user with this email or not since this is an unprotected endpoint.
          return errorForType(ErrorType.WRONG_EMAIL_OR_PASSWORD);
        }
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
          return errorForType(ErrorType.WRONG_EMAIL_OR_PASSWORD);
        }

        const accessJWT = createAccessJWT(user);
        const refreshJWT = createRefreshJWT(user);
        return renderLoginResponse(user, accessJWT, refreshJWT);
      }
    }
  }
};
