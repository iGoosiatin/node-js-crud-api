import { ServerResponse } from 'http';

export const sendSuccess = (res: ServerResponse, data?: unknown) => {
  res.statusCode = 200;
  res.end(JSON.stringify(data));
};

export const sendBadRequest = (res: ServerResponse, message = 'Bad request') => {
  res.statusCode = 400;
  res.end(JSON.stringify({ message }));
};

export const sendInternalServerError = (res: ServerResponse, message = 'Internal Server Error') => {
  res.statusCode = 500;
  res.end(JSON.stringify({ message }));
};

export const sendNotFound = (res: ServerResponse, message: string) => {
  res.statusCode = 404;
  res.end(JSON.stringify({ message }));
};
