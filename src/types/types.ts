export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

/** Basic Error interface to be used by all errors */
export type Error = {
  /** The error message */
  message: Scalars['String'];
  /** Unique error type code */
  code: Scalars['String'];
};

/** Update User Input */
export type LoginInput = {
  /** The user's email */
  email: Scalars['String'];
  /** The user's password */
  password: Scalars['String'];
};

/** Create a new user account */
export type Mutation = {
  __typename?: 'Mutation';
  /**  This mutation will delete a user */
  deleteUser?: Maybe<UserDeleteResult>;
  /**  This mutation takes email and password parameters and responds with a User or error if user already exists */
  register?: Maybe<UserRegisterResult>;
  /** The mutation will update a user and return a user object */
  updateUser?: Maybe<UserUpdateResult>;
};


/** Create a new user account */
export type MutationDeleteUserArgs = {
  id: Scalars['String'];
};


/** Create a new user account */
export type MutationRegisterArgs = {
  input: RegisterInput;
};


/** Create a new user account */
export type MutationUpdateUserArgs = {
  id: Scalars['String'];
  input: UpdateUserPayload;
};

/** Generic entity successful delete result */
export type ObjectDeleteResult = {
  __typename?: 'ObjectDeleteResult';
  /** Success flag */
  success: Scalars['Boolean'];
};

/** Get request caller user result */
export type Query = {
  __typename?: 'Query';
  /**  This query takes a user id as a parameter and responds with a UserResult */
  getUser?: Maybe<UserResult>;
  /**  This query takes email and password parameters and responds with a User or error if user already exists */
  login?: Maybe<UserLoginResult>;
  /**  This query will return the caller's user result */
  me?: Maybe<UserResult>;
};


/** Get request caller user result */
export type QueryGetUserArgs = {
  id: Scalars['String'];
};


/** Get request caller user result */
export type QueryLoginArgs = {
  input: LoginInput;
};

/** Register Input */
export type RegisterInput = {
  email: Scalars['String'];
  password: Scalars['String'];
  role?: Maybe<Scalars['String']>;
  first_name?: Maybe<Scalars['String']>;
  last_name?: Maybe<Scalars['String']>;
};

/** Update User Input */
export type UpdateUserPayload = {
  /** The user's email */
  email?: Maybe<Scalars['String']>;
  /** The user's first name */
  first_name?: Maybe<Scalars['String']>;
  /** The user's last name */
  last_name?: Maybe<Scalars['String']>;
};

/** User Object */
export type User = {
  __typename?: 'User';
  /** The user's id (uuid) */
  id: Scalars['String'];
  /** The user's email */
  email: Scalars['String'];
  /** The user role enum (admin/manager/client/user) */
  role: Scalars['String'];
  /** The user's first name */
  first_name?: Maybe<Scalars['String']>;
  /** The user's last name */
  last_name?: Maybe<Scalars['String']>;
};

/** User already exists for email error */
export type UserAlreadyExistsError = Error & {
  __typename?: 'UserAlreadyExistsError';
  /** The error message */
  message: Scalars['String'];
  /** The error code */
  code: Scalars['String'];
};

export type UserDeleteResult = UserNotFoundError | ObjectDeleteResult;

/** Successful login response object including the user object and access jwt tokens */
export type UserLogin = {
  __typename?: 'UserLogin';
  /** User account */
  user: User;
  /** Short lived jwt access token */
  accessToken: Scalars['String'];
  /** Long lived jwt access token */
  refreshToken: Scalars['String'];
};

/** Login result */
export type UserLoginResult = UserLogin | WrongEmailOrPasswordError;

/** User not found error */
export type UserNotFoundError = Error & {
  __typename?: 'UserNotFoundError';
  /** The error message */
  message: Scalars['String'];
  /** The error code */
  code: Scalars['String'];
};

/** User register result */
export type UserRegisterResult = UserLogin | UserAlreadyExistsError;

/** User result for fetching/updating a user */
export type UserResult = User | UserNotFoundError;

export type UserUpdateResult = User | UserNotFoundError | UserAlreadyExistsError;

/** Login error with bad credentials */
export type WrongEmailOrPasswordError = Error & {
  __typename?: 'WrongEmailOrPasswordError';
  /** The error message */
  message: Scalars['String'];
  /** The error code */
  code: Scalars['String'];
};
