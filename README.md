# Experimental Project Build with Apollo Server & TypeORM

## Getting started

- Install [Docker](https://hub.docker.com/search?type=edition&offering=community)
- Install [Docker Compose](https://docs.docker.com/compose/install/)
- Run `docker compose up`
- Run `yarn install`
- Run `yarn start`

Once the server is running go to: http://localhost:4000/graphql

## Running tests

- Run `docker-compose -f docker-compose.test.yml up`
- Run `yarn test`

# Useful queries

## Register

```gql
mutation Mutation($registerInput: RegisterInput!) {
  register(input: $registerInput) {
    ... on UserLogin {
      user {
        id
        email
        role
        first_name
        last_name
      }
      accessToken
      refreshToken
    }
    ... on UserAlreadyExistsError {
      message
      code
    }
  }
}
```

### Query Variable

```json
{
  "registerInput": {
    "email": "your@email.com",
    "password": "YourPassword",
    "role": "manager",
    "first_name": "Oren",
    "last_name": "Manager"
  }
}
```

## Login

```gql
query Query($loginInput: LoginInput!) {
  login(input: $loginInput) {
    ... on UserLogin {
      user {
        id
        email
        role
        first_name
        last_name
      }
      accessToken
      refreshToken
    }
    ... on WrongEmailOrPasswordError {
      message
      code
    }
  }
}
```

Query Variable:

```json
{
  "loginInput": {
    "email": "your@email.com",
    "password": "YourPassword"
  }
}
```

## Get User

```gql
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
```

Query Variable:

```json
{
  "getUserId": "your_user_id_goes_here"
}
```

Add Authorization header (use the `accessToken` from the login or register response)

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiMmRlMGFiYjktODMyYi00MGVjLWEyYjgtYzM4NWRkZDliMDJlIiwicm9sZXMiOlsibWFuYWdlciJdfSwiaWF0IjoxNjI1NDE4NjA3LCJleHAiOjE2MjU0MTk1MDcsInN1YiI6IjJkZTBhYmI5LTgzMmItNDBlYy1hMmI4LWMzODVkZGQ5YjAyZSJ9.qwDBYWJKxMaF2XyBeMQdgSJqOGCfwjfvHh-TQemnkJw"
}
```

## Update User

```gql
mutation UpdateUserMutation(
  $updateUserId: String!
  $updateUserInput: UpdateUserPayload!
) {
  updateUser(id: $updateUserId, input: $updateUserInput) {
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
    ... on UserAlreadyExistsError {
      message
      code
    }
  }
}
```

Query Variable:

```json
{
  "updateUserId": "your_user_id_goes_here",
  "updateUserInput": {
    "first_name": "Update First Name",
    "last_name": "Update Last Name"
  }
}
```

Add Authorization header same as `Get User`

## Delete User

```gql
mutation UpdateUserMutation($deleteUserId: String!) {
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
```

Query Variable:

```json
{
  "deleteUserId": "your_user_id_goes_here"
}
```

Add Authorization header same as `Get User`
