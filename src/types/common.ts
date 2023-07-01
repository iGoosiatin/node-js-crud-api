import { IncomingMessage, ServerResponse } from 'http';

export const METHOD = {
  GET: 'get',
  POST: 'post',
  PUT: 'put',
  DELETE: 'delete',
} as const;

export type Method = (typeof METHOD)[keyof typeof METHOD];

export type HandlerFunction = (req: IncomingMessage, res: ServerResponse) => Promise<void>;

export type RouteHandle = [string, Method, HandlerFunction];

export interface Launchable {
  start(): void;
}
