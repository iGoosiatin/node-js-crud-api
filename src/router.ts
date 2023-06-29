import { IncomingMessage, ServerResponse } from 'http';
import { HandlerFunction, METHOD, Method, RouteHandle } from './types/common';
import { sendBadRequest, sendNotFound } from './utils/responses';

type RouterRoute = {
  originalRoute: string;
  routeMatcher: RegExp;
  routeHandler: HandlerFunction;
};

export default class Router {
  routeMap: Map<Method, RouterRoute[]> = new Map(Object.values(METHOD).map((method) => [method, []]));

  constructor(routes: Array<RouteHandle[]>) {
    this._processRoutes(routes.flat());
  }

  async handle(req: IncomingMessage, res: ServerResponse) {
    const { url, method } = req;

    const handler = this._findRouteHander(url, method);

    if (handler) {
      try {
        await handler(req, res);
      } catch {
        sendBadRequest(res);
      }
    } else {
      sendNotFound(res, 'Endpoint does not exist');
    }
  }

  private _processRoutes(routes: RouteHandle[]) {
    routes.forEach(([originalRoute, method, routeHandler]) => {
      const routeMethod = this.routeMap.get(method);
      if (routeMethod) {
        // TODO: chech if route already exists before push
        const routeMatcher = new RegExp(`^${originalRoute.replace(/:.*/, '.+')}$`);
        routeMethod.push({ routeMatcher, routeHandler, originalRoute });
      }
    });
  }

  private _findRouteHander(url = '', reqMethod = '') {
    const methodRoutes = this.routeMap.get(reqMethod.toLowerCase() as Method);

    if (!methodRoutes) {
      return null;
    }

    const match = methodRoutes.find(({ routeMatcher }) => url.match(routeMatcher));

    if (!match) {
      return null;
    }

    return match.routeHandler;
  }
}
