import { getParamFromUrl, getParsedRequestData } from '../utils/requests';
import UsersModel from '../models/users.model';
import { sendNotFound, sendSuccess } from '../utils/responses';
import { IncomingMessage, ServerResponse } from 'http';
import { UserFromRequest } from '../types/users';

const userModel = new UsersModel();

export const getUsers = async (_: IncomingMessage, res: ServerResponse) => {
  const users = await userModel.getUsers();
  sendSuccess(res, users);
};

export const getUser = async (req: IncomingMessage, res: ServerResponse) => {
  const id = getParamFromUrl(req);

  // TODO: validate id!
  const user = await userModel.getUser(id);
  if (user) {
    sendSuccess(res, user);
  } else {
    sendNotFound(res, 'User does not exist');
  }
};

export const createUser = async (req: IncomingMessage, res: ServerResponse) => {
  const newUserData = await getParsedRequestData<UserFromRequest>(req);

  // TODO: validate data!
  const newUser = await userModel.createUser(newUserData);
  sendSuccess(res, newUser);
};
