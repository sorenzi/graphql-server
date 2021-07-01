export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  CLIENT = 'client',
  USER = 'user'
}

export type UserRoleType =
  | UserRole.ADMIN
  | UserRole.MANAGER
  | UserRole.CLIENT
  | UserRole.USER;

export const UserRoles = [
  UserRole.ADMIN,
  UserRole.MANAGER,
  UserRole.CLIENT,
  UserRole.USER
];
