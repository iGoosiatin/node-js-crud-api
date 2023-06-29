import { Server, createServer } from 'http';

import Router from './router';
import usersRouteHandlers from './routes/users.routes';

export default class SimpleCrudServer {
  basePort: number;
  server: Server;
  router = new Router([usersRouteHandlers]);

  constructor(basePort: number) {
    this.basePort = basePort;

    this.server = createServer((req, res) => {
      res.setHeader('Content-Type', 'application/json');
      this.router.handle(req, res);
    });
  }

  start() {
    this.server.listen(this.basePort, () => console.log(`Server started on ${this.basePort}`));
  }
}
