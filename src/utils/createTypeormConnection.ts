import { createConnection, getConnectionOptions } from 'typeorm';

// Create a connection you the db
export const createTypeormConnection = async () => {
  const env = process.env.NODE_ENV ?? 'default';
  const connectionOptions = await getConnectionOptions(env);
  return createConnection({ ...connectionOptions, name: 'default' });
};
