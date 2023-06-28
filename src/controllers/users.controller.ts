import { sendSuccess } from '../helpers';
import { IncomingMessage, ServerResponse } from 'http';

export const getUsers = async (_: IncomingMessage, res: ServerResponse) => {
  sendSuccess(res, ['users']);
};

export const getUser = async (req: IncomingMessage, res: ServerResponse) => {
  sendSuccess(res, 'user');
};
