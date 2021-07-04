import { sign, verify } from 'jsonwebtoken';
import User from '../entity/User';

const AccessTokenDuration = process.env.ACCESS_TOKEN_DURATION || 60 * 15; // 15 min
const RefreshTokenDuration = process.env.REFRESH_TOKEN_DURATION || 60 * 60 * 24; // 1 days

export const JWTAlgorithm = 'HS256';
export const JWTSecret = process.env.JWT_SECRET || 'some_long_weird_secret_key';

export const createAccessJWT = (user: User) => {
  return createUserJWT(user.id, user.role, AccessTokenDuration);
};

export const createRefreshJWT = (user: User) => {
  return createUserJWT(user.id, user.role, RefreshTokenDuration);
};

const createUserJWT = (
  userId: string,
  role: string,
  expiresIn: number | string
) => {
  return sign({ user: { id: userId, roles: [role] } }, JWTSecret, {
    algorithm: JWTAlgorithm,
    subject: userId,
    expiresIn
  });
};

export const verifyJWT = (jwt: string) => {
  const result = decodeJWT(jwt);
  return result !== false;
};

export const decodeJWT = (jwt: string): string | boolean => {
  try {
    const decoded = verify(jwt, JWTSecret);
    return decoded as string;
  } catch (error) {
    return false;
  }
};
