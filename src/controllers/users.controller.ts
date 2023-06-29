import { IncomingMessage, ServerResponse } from 'http';

import { getParamFromUrl, getParsedRequestData } from '../utils/requests';
import UsersModel from '../services/users.service';
import { sendBadRequest, sendNotFound, sendSuccess } from '../utils/responses';
import { UserFromRequest } from '../types/users';
import Validator from '../utils/validator';

const userModel = new UsersModel();

export const getUsers = async (_: IncomingMessage, res: ServerResponse) => {
  const users = await userModel.getUsers();
  sendSuccess()(res, users);
};

export const getUser = async (req: IncomingMessage, res: ServerResponse) => {
  const id = getParamFromUrl(req);

  try {
    new Validator('id', id).isString().isUUID();
  } catch (error) {
    sendBadRequest(res, (error as Error).message);
    return;
  }

  const user = await userModel.getUser(id);
  if (user) {
    sendSuccess()(res, user);
  } else {
    sendNotFound(res, 'User does not exist');
  }
};

export const createUser = async (req: IncomingMessage, res: ServerResponse) => {
  const { username, age, hobbies } = await getParsedRequestData<UserFromRequest>(req);

  try {
    new Validator('username', username).isString();
    new Validator('age', age).isNumber();
    new Validator('hobbies', hobbies).isArray().ofStrings();
  } catch (error) {
    sendBadRequest(res, (error as Error).message);
    return;
  }
  const newUser = await userModel.createUser(username, age, hobbies);
  sendSuccess(201)(res, newUser);
};

export const updateUser = async (req: IncomingMessage, res: ServerResponse) => {
  const id = getParamFromUrl(req);
  const { username, age, hobbies } = await getParsedRequestData<UserFromRequest>(req);

  try {
    new Validator('id', id).isString().isUUID();
    new Validator('username', username).isString();
    new Validator('age', age).isNumber();
    new Validator('hobbies', hobbies).isArray().ofStrings();
  } catch (error) {
    sendBadRequest(res, (error as Error).message);
    return;
  }

  const user = await userModel.updateUser(id, username, age, hobbies);
  if (user) {
    sendSuccess()(res, user);
  } else {
    sendNotFound(res, 'User does not exist');
  }
};

export const deleteUser = async (req: IncomingMessage, res: ServerResponse) => {
  const id = getParamFromUrl(req);

  try {
    new Validator('id', id).isString().isUUID();
  } catch (error) {
    sendBadRequest(res, (error as Error).message);
    return;
  }

  const result = await userModel.deleteUser(id);
  if (result) {
    sendSuccess(204)(res);
  } else {
    sendNotFound(res, 'User does not exist');
  }
};
