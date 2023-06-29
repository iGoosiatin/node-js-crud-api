import { IncomingMessage, Server, ServerResponse, createServer, request } from 'http';
import { availableParallelism } from 'os';
import cluster from 'cluster';

import Router from './router';
import usersRouteHandlers from './routes/users.routes';
import { createRoundRobin } from './utils/roundRobin';
import { RequestOptions } from 'https';

type SimpleCrudServerOptions = {
  cluster?: boolean;
};

export default class SimpleCrudServer {
  port: number;
  server: Server;
  router = new Router([usersRouteHandlers]);
  clusterMode = false;
  roundRobin = createRoundRobin(availableParallelism() - 1);

  constructor(port: number, options?: SimpleCrudServerOptions) {
    this.port = port;
    this._parseOptions(options);

    this.server = createServer(this.clusterMode && cluster.isPrimary ? this._createLoadBalancer : this._createWorker);
  }

  start() {
    if (cluster.isPrimary) {
      const maxWorkers = this.clusterMode ? availableParallelism() - 1 : 0;

      if (this.clusterMode && maxWorkers < 1) {
        throw new Error('Cannot start in cluster mode');
      }

      for (let i = 1; i <= maxWorkers; i++) {
        cluster.fork({ PORT: this.port + i });
      }
    }

    this.server.listen(this.port, () =>
      console.log(`${cluster.isPrimary ? 'Server' : 'Worker'} started on ${this.port}`),
    );
  }

  private _parseOptions(options?: SimpleCrudServerOptions) {
    if (!options) {
      return;
    }
    this.clusterMode = options.cluster || false;
  }

  private _createLoadBalancer = (req: IncomingMessage, res: ServerResponse) => {
    const port = this.port + this.roundRobin();
    const { url: path, method } = req;
    const options: RequestOptions = { port, path, method };

    const workerCallback = (workerRes: IncomingMessage) => {
      const { statusCode, headers } = workerRes;
      res.statusCode = statusCode || 500;
      Object.entries(headers).forEach(([key, value]) => {
        value && res.setHeader(key, value);
      });
      workerRes.pipe(res);
    };

    const requestToWorker = request(options, workerCallback);
    req.pipe(requestToWorker);
  };

  private _createWorker = (req: IncomingMessage, res: ServerResponse) => {
    res.setHeader('Content-Type', 'application/json');
    cluster.isWorker && res.setHeader('Responder', `Worker-${cluster?.worker?.id}`);
    this.router.handle(req, res);
  };
}
