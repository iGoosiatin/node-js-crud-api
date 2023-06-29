import { RouteHandle, METHOD } from '../types/common';
import { createUser, deleteUser, getUser, getUsers, updateUser } from '../controllers/users.controller';

const usersRouteHandlers: RouteHandle[] = [
  ['/api/users', METHOD.GET, getUsers],
  ['/api/users', METHOD.POST, createUser],
  ['/api/users/:id', METHOD.GET, getUser],
  ['/api/users/:id', METHOD.PUT, updateUser],
  ['/api/users/:id', METHOD.DELETE, deleteUser],
];

export default usersRouteHandlers;
