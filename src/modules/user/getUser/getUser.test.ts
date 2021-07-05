/* eslint-disable no-undef */
import { Connection, getConnection } from 'typeorm';

import { startServer } from '../../../server';
import {
  createUser,
  generateAccessToken,
  getUser,
  client,
  truncateDB
} from '../../../test/testUtils';

const query = () => `
query Query($getUserId: String!) {
  getUser(id: $getUserId) {
    ... on User {
      id
      email
      role
      first_name
      last_name
    }
    ... on UserNotFoundError {
      message
      code
    }
  }
}
`;

let conn: Connection;
let server: any;
beforeAll(async () => {
  server = await startServer();
  conn = getConnection();
});

afterAll(async () => {
  await server.close();
  await truncateDB(conn);
  conn.close();
});

beforeEach(async () => {
  await truncateDB(conn);
});

const compareUsers = (user1: any, user2: any) => {
  expect(user1.id).toEqual(user2.id);
  expect(user1.email).toEqual(user2.email);
  expect(user1.role).toEqual(user2.role);
  expect(user1.first_name).toEqual(user2.first_name);
  expect(user1.last_name).toEqual(user2.last_name);
};

test('Get user', async () => {
  const newUser = await createUser();
  const authToken = generateAccessToken(newUser);

  client.setHeader('authorization', `Bearer ${authToken}`);
  const response = await client.request(query(), {
    getUserId: newUser.id
  });

  const userResponse = response.getUser;
  compareUsers(userResponse, newUser);
  const user = await getUser(newUser.id);
  compareUsers(user, newUser);
});

test('Get non existing user', async () => {
  const newUser = await createUser();
  const authToken = generateAccessToken(newUser);

  client.setHeader('authorization', `Bearer ${authToken}`);
  const response = await client.request(query(), {
    getUserId: 'be650e6a-bde0-419d-b06a-f8d6119ba611'
  });

  expect(response).toEqual({
    getUser: { message: 'User not found', code: 'UserNotFoundError' }
  });
});
