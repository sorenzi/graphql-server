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

export const errorForType = (type: ErrorType) => {
  return {
    __typename: errorTypename(type),
    message: errorMessage(type)
  };
};
