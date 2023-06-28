import { getParsedRequestData } from '../utils/requests';
import UsersModel from '../models/users.model';
import { sendSuccess } from '../utils/responses';
import { IncomingMessage, ServerResponse } from 'http';
import { UserFromRequest } from '../types/users';

const userModel = new UsersModel();

export const getUsers = async (_: IncomingMessage, res: ServerResponse) => {
  const users = await userModel.getUsers();
  sendSuccess(res, users);
};

export const getUser = async (req: IncomingMessage, res: ServerResponse) => {
  sendSuccess(res, 'user');
};

export const createUser = async (req: IncomingMessage, res: ServerResponse) => {
  const newUserData = await getParsedRequestData<UserFromRequest>(req);
  const newUser = await userModel.createUser(newUserData);
  sendSuccess(res, newUser);
};
