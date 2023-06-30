import { IncomingMessage, RequestOptions, Server, ServerResponse, createServer, request } from 'http';
import { availableParallelism } from 'os';
import cluster from 'cluster';

import Router from './router';
import usersRouteHandlers from './routes/users.routes';
import { createRoundRobin } from './utils/roundRobin';

import Database, { DatabaseInquiryMessage, IDatabase } from './db';

type SimpleCrudServerOptions = {
  cluster?: boolean;
};

export default class SimpleCrudServer {
  port: number;
  server: Server;
  router = new Router([usersRouteHandlers]);
  clusterMode = false;
  clusterDb: IDatabase;
  roundRobin: () => number;

  constructor(port: number, options?: SimpleCrudServerOptions) {
    this.port = port;
    this._parseOptions(options);

    if (this.clusterMode) {
      this.clusterDb = new Database();
      this.roundRobin = createRoundRobin(availableParallelism() - 1);
    }

    this.server = createServer(this.clusterMode && cluster.isPrimary ? this._loadBalancerCb : this._serverCb);
  }

  start() {
    if (cluster.isPrimary) {
      const maxWorkers = this.clusterMode ? availableParallelism() - 1 : 0;

      if (this.clusterMode && maxWorkers < 1) {
        throw new Error('Cannot start in cluster mode');
      }

      for (let i = 1; i <= maxWorkers; i++) {
        const worker = cluster.fork({ PORT: this.port + i });

        worker.on('message', async (message: DatabaseInquiryMessage) => {
          if (message && message.dbCall) {
            const {
              dbCall: { handler, stringifiedArgs },
            } = message;

            const [arg1, arg2, arg3] = JSON.parse(stringifiedArgs);
            const result = await this.clusterDb[handler](arg1, arg2, arg3);

            const stringifiedResult = JSON.stringify(result);
            worker.send(stringifiedResult);
          }
        });
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

  private _loadBalancerCb = (req: IncomingMessage, res: ServerResponse) => {
    const port = this.port + this.roundRobin();
    const { url: path, method, headers } = req;
    const options: RequestOptions = { port, path, method, headers };

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

  private _serverCb = (req: IncomingMessage, res: ServerResponse) => {
    res.setHeader('Content-Type', 'application/json');
    cluster.isWorker && res.setHeader('Responder', `Worker-${cluster?.worker?.id}`);
    this.router.handle(req, res);
  };
}
