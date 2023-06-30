import { IncomingMessage, ServerResponse } from 'http';

import UsersService from '../services/users.service';
import { UserFromRequest } from '../types/users';

import { getParamFromUrl, getParsedRequestData } from '../utils/requests';
import { sendBadRequest, sendNotFound, sendSuccess } from '../utils/responses';
import Validator from '../utils/validator';

const usersService = new UsersService();

export const getUsers = async (_: IncomingMessage, res: ServerResponse) => {
  const users = await usersService.getUsers();

  sendSuccess()(res, users);
};

export const getUser = async (req: IncomingMessage, res: ServerResponse) => {
  let id: string;

  try {
    id = getParamFromUrl(req);
    new Validator('id', id).isString().isUUID();
  } catch (error) {
    sendBadRequest(res, (error as Error).message);
    return;
  }

  const user = await usersService.getUser(id);
  if (user) {
    sendSuccess()(res, user);
  } else {
    sendNotFound(res, 'User does not exist');
  }
};

export const createUser = async (req: IncomingMessage, res: ServerResponse) => {
  let reqData: UserFromRequest;

  try {
    reqData = await getParsedRequestData<UserFromRequest>(req);
    new Validator('username', reqData.username).isString();
    new Validator('age', reqData.age).isNumber();
    new Validator('hobbies', reqData.hobbies).isArray().ofStrings();
  } catch (error) {
    sendBadRequest(res, (error as Error).message);
    return;
  }

  const newUser = await usersService.createUser(reqData.username, reqData.age, reqData.hobbies);
  sendSuccess(201)(res, newUser);
};

export const updateUser = async (req: IncomingMessage, res: ServerResponse) => {
  let id: string;
  let reqData: UserFromRequest;

  try {
    id = getParamFromUrl(req);
    reqData = await getParsedRequestData<UserFromRequest>(req);
    new Validator('id', id).isString().isUUID();
    new Validator('username', reqData.username).isOptional().isString();
    new Validator('age', reqData.age).isOptional().isNumber();
    new Validator('hobbies', reqData.hobbies).isOptional().isArray().ofStrings();

    if ([reqData.username, reqData.age, reqData.hobbies].every((prop) => prop === undefined)) {
      throw new Error('Bad request');
    }
  } catch (error) {
    sendBadRequest(res, (error as Error).message);
    return;
  }

  const user = await usersService.updateUser(id, reqData.username, reqData.age, reqData.hobbies);

  if (user) {
    sendSuccess()(res, user);
  } else {
    sendNotFound(res, 'User does not exist');
  }
};

export const deleteUser = async (req: IncomingMessage, res: ServerResponse) => {
  let id: string;

  try {
    id = getParamFromUrl(req);
    new Validator('id', id).isString().isUUID();
  } catch (error) {
    sendBadRequest(res, (error as Error).message);
    return;
  }

  const result = await usersService.deleteUser(id);

  if (result) {
    sendSuccess(204)(res);
  } else {
    sendNotFound(res, 'User does not exist');
  }
};
