/* eslint-disable no-undef */
import { Connection, getConnection } from 'typeorm';

import { GraphQLClient } from 'graphql-request';
import { startServer } from '../../../server';
import {
  createUser,
  generateAccessToken,
  getUser,
  truncateDB
} from '../../../test/testUtils';
import { UserRole } from '../constants';

const endpoint = 'http://localhost:4000/graphql';
const client = new GraphQLClient(endpoint);

const mutation = () => `
mutation Mutation($deleteUserId: String!) {
  deleteUser(id: $deleteUserId) {
    ... on UserNotFoundError {
      message
      code
    }
    ... on ObjectDeleteResult {
      success
    }
  }
}
`;

// Using this query to make sure we validate non variable user input in the gql query
const inlineIdMutation = (id: string) => `
mutation {
  deleteUser(id: "${id}") {
    ... on UserNotFoundError {
      message
      code
    }
    ... on ObjectDeleteResult {
      success
    }
  }
}
`;

let conn: Connection;
beforeAll(async () => {
  await startServer();
  conn = getConnection();
});

afterAll(async () => {
  await truncateDB(conn);
  conn.close();
});

beforeEach(async () => {
  await truncateDB(conn);
});

test('Delete user as admin', async () => {
  const newUser = await createUser();
  const authToken = generateAccessToken(newUser);

  client.setHeader('authorization', `Bearer ${authToken}`);
  const response = await client.request(mutation(), {
    deleteUserId: newUser.id
  });
  expect(response).toEqual({
    deleteUser: {
      success: true
    }
  });

  const user = await getUser(newUser.id);
  expect(user).toBeUndefined();
});

test('Delete user as non admin', async () => {
  const newUser = await createUser(undefined, undefined, UserRole.MANAGER);
  const authToken = generateAccessToken(newUser);

  client.setHeader('authorization', `Bearer ${authToken}`);
  try {
    await client.request(mutation(), {
      deleteUserId: newUser.id
    });
  } catch (err) {
    expect(err.response.errors[0].message).toEqual('Insufficient scope');
    return;
  }
  // we should not reach this point
  expect(false).toBeTruthy();
});

test('Delete user that doesnt exists', async () => {
  const admin = await createUser();
  const authToken = generateAccessToken(admin);

  client.setHeader('authorization', `Bearer ${authToken}`);
  const response = await client.request(mutation(), {
    deleteUserId: 'c4cf454e-02fe-4728-bc44-258005262d92'
  });
  expect(response).toEqual({
    deleteUser: { message: 'User not found', code: 'UserNotFoundError' }
  });
});

// making sure we parse non variable user input correctly
test('Delete user using inline input', async () => {
  const admin = await createUser();
  const authToken = generateAccessToken(admin);

  client.setHeader('authorization', `Bearer ${authToken}`);
  const response = await client.request(inlineIdMutation(admin.id));
  expect(response).toEqual({
    deleteUser: {
      success: true
    }
  });

  const user = await getUser(admin.id);
  expect(user).toBeUndefined();
});

// making sure our Joi validation is working as expected
test('Delete user using invalid input', async () => {
  const admin = await createUser();
  const authToken = generateAccessToken(admin);

  client.setHeader('authorization', `Bearer ${authToken}`);
  try {
    await client.request(inlineIdMutation('1234'));
  } catch (err) {
    expect(err.response.errors[0].message).toEqual('Invalid user input');
    return;
  }
  // we should not reach this point
  expect(false).toBeTruthy();
});
