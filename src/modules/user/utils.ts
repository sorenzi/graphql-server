import { DeepPartial } from 'typeorm';
import User from '../../entity/User';

export const getUserByEmail = async (email: string) => {
  const user = await User.findOne({ where: { email } });
  return user;
};

export const getUserById = async (id: string) => {
  const user = await User.findOne({ where: { id } });
  return user;
};

export const createUser = async (payload: DeepPartial<User>) => {
  const user = User.create(payload);
  await user.save();
  return user;
};

export const updateUser = async (id: string, payload: any) => {
  await User.update({ id }, payload);
};

export const deleteUser = async (id: string) => {
  await User.delete({ id });
};

export const renderUser = (user: User) => {
  return {
    __typename: 'User',
    ...user
  };
};

export const renderLoginResponse = (
  user: User,
  accessToken: string,
  refreshToken: string
) => {
  return {
    __typename: 'UserLogin',
    user: {
      ...user
    },
    accessToken,
    refreshToken
  };
};
