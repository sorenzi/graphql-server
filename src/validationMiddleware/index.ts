import { verify } from 'jsonwebtoken';

export default (secret: string) => {
  if (secret.length === 0) throw new Error('Secret cannot be empty');

  const jwtSecret = secret;

  const middleware = ({ req }: any) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return;
    }

    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      return;
    }

    let decodeToken: any;
    try {
      decodeToken = verify(token, jwtSecret);
    } catch (err) {
      return;
    }

    // in case any error found
    if (!decodeToken) {
      console.warn('Unable to decode auth token');
      return;
    }

    const { user } = decodeToken;
    if (!user) {
      return;
    }
    return {
      user
    };
  };
  return middleware;
};
