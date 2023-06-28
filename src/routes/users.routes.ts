import { RouteHandle, METHOD } from '../types/common';
import { createUser, getUser, getUsers } from '../controllers/users.controller';

const usersRouteHandlers: RouteHandle[] = [
  ['/api/users', METHOD.GET, getUsers],
  ['/api/users', METHOD.POST, createUser],
  ['/api/users/:id', METHOD.GET, getUser],
];

export default usersRouteHandlers;
