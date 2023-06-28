import { IncomingMessage, ServerResponse } from 'http';

export const METHOD = {
  GET: 'get',
  POST: 'post',
  PUT: 'put',
  DELETE: 'delete',
} as const;

export type Method = (typeof METHOD)[keyof typeof METHOD];

export type HandlerFunction = (req: IncomingMessage, res: ServerResponse) => void;

export type RouteHandle = [string, Method, HandlerFunction];
