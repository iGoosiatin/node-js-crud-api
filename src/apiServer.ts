import { Server, createServer } from 'http';
import cluster from 'cluster';

import Router from './router';
import usersRouteHandlers from './routes/users.routes';
import { Launchable } from './types/common';

export default class ApiServer implements Launchable {
  private port: number;
  // server is non private for simplicity of e2e tests
  server: Server;
  private router = new Router([usersRouteHandlers]);

  constructor(port: number) {
    this.port = port;

    this.server = createServer((req, res) => {
      res.setHeader('Content-Type', 'application/json');
      cluster.isWorker && res.setHeader('Responder', `Worker-${cluster?.worker?.id}`);
      this.router.handle(req, res);
    });
  }

  start() {
    this.server.listen(this.port, () =>
      console.log(`${cluster.isPrimary ? 'Server' : 'Worker'} started on ${this.port}`),
    );
  }
}
