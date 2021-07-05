import { Connection } from 'typeorm';
import User from '../entity/User';
import { createAccessJWT } from '../utils/jwtUtil';
import * as faker from 'faker';
import { UserRole } from '../modules/user/constants';

export const truncateDB = async (connection: Connection) => {
  if (process.env.NODE_ENV !== 'test') {
    return;
  }
  await connection.dropDatabase();
  await connection.synchronize();
};

export const generateAccessToken = (user: User) => {
  return createAccessJWT(user);
};

export const createUser = async (
  email: string = faker.internet.email(),
  password: string = faker.internet.password(),
  role: UserRole = UserRole.ADMIN,
  first_name: string = faker.name.firstName(),
  last_name: string = faker.name.lastName()
) => {
  const user = User.create({ email, password, role, first_name, last_name });
  await user.save();
  return user;
};

export const getUser = async (id: string) => {
  const user = await User.findOne({ where: { id } });
  return user;
};
