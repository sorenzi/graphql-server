import { ApolloError } from 'apollo-server-errors';

export enum ErrorType {
  USER_NOT_FOUND,
  WRONG_EMAIL_OR_PASSWORD,
  USER_WITH_EMAIL_EXISTS
}

const errorMessage = (type: ErrorType): string => {
  switch (type) {
    case ErrorType.USER_NOT_FOUND:
      return 'User not found';
    case ErrorType.WRONG_EMAIL_OR_PASSWORD:
      return 'Wrong email or password';
    case ErrorType.USER_WITH_EMAIL_EXISTS:
      return 'User with email already exists';
  }
};
/*
const errorTypename = (type: ErrorType): string => {
  switch (type) {
    case ErrorType.USER_NOT_FOUND:
      return 'UserNotFoundError';
    case ErrorType.WRONG_EMAIL_OR_PASSWORD:
      return 'WrongEmailOrPasswordError';
    case ErrorType.USER_WITH_EMAIL_EXISTS:
      return 'UserAlreadyExistsError';
  }
};
*/
const errorCode = (type: ErrorType): string => {
  switch (type) {
    case ErrorType.USER_NOT_FOUND:
      return 'USER_NOT_FOUND';
    case ErrorType.WRONG_EMAIL_OR_PASSWORD:
      return 'WRONG_EMAIL_OR_PASSWORD';
    case ErrorType.USER_WITH_EMAIL_EXISTS:
      return 'USER_WITH_EMAIL_EXISTS';
  }
};

export const errorForType = (type: ErrorType, options?: {}): ApolloError => {
  return new ApolloError(errorMessage(type), errorCode(type), options);
};
