import { IncomingMessage, RequestOptions, Server, ServerResponse, createServer, request } from 'http';
import { availableParallelism } from 'os';

import { createRoundRobin } from './utils/roundRobin';
import { Launchable } from './types/common';

export default class LoadBalancer implements Launchable {
  private port: number;
  private server: Server;
  private roundRobin: () => number;

  constructor(port: number) {
    this.port = port;
    this.roundRobin = createRoundRobin(availableParallelism() - 1);

    this.server = createServer((req: IncomingMessage, res: ServerResponse) => {
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
    });
  }

  start() {
    this.server.listen(this.port, () => console.log(`Server started on ${this.port}`));
  }
}
