import { sign, verify } from 'jsonwebtoken';
import User from '../entity/User';

const secret = process.env.JWT_SECRET || 'some_long_weird_secret_key';
const AccessTokenDuration = process.env.ACCESS_TOKEN_DURATION || 60 * 15; // 15 min
const RefreshTokenDuration = process.env.REFRESH_TOKEN_DURATION || 60 * 60 * 24; // 1 days

export const createAccessJWT = (user: User) => {
  return createUserJWT(user.id, AccessTokenDuration);
};

export const createRefreshJWT = (user: User) => {
  return createUserJWT(user.id, RefreshTokenDuration);
};

const createUserJWT = (userId: string, expiresIn: number | string) => {
  // const scopes: string[] = [];
  return sign({ user_id: userId }, secret, {
    algorithm: 'HS256',
    expiresIn
  });
};

export const verifyJWT = (jwt: string) => {
  const result = decodeJWT(jwt);
  return result !== false;
};

export const decodeJWT = (jwt: string): string | boolean => {
  try {
    const decoded = verify(jwt, secret);
    return decoded as string;
  } catch (error) {
    return false;
  }
};
