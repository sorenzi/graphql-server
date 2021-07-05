import { AuthenticationError } from 'apollo-server-express';
import { verify } from 'jsonwebtoken';

export const validateJWTAuth = (
  request: any,
  secret: string,
  scope?: string[]
) => {
  const header = request.headers.authorization;
  // not found
  if (!header) throw new AuthenticationError('UnAuthenticated');

  const token: string = header.replace('Bearer ', '');
  if (!token) throw new AuthenticationError('UnAuthenticated');

  let decodeToken: any;
  try {
    decodeToken = verify(token, secret);
  } catch (err) {
    throw new AuthenticationError('UnAuthenticated');
  }

  // in case any error found
  if (!decodeToken) {
    throw new AuthenticationError('UnAuthenticated');
  }

  const { user } = decodeToken;
  if (scope) {
    if (!user.role || !scope.includes(user.role)) {
      throw new AuthenticationError('Insufficient scope');
    }
  }

  // token decoded successfully, returning user object
  return { user };
};
