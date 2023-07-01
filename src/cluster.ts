import { availableParallelism } from 'os';
import cluster from 'cluster';

import Database, { DatabaseInquiryMessage } from './db';
import { Launchable } from './types/common';
import LoadBalancer from './loadBalancer';
import ApiServer from './apiServer';

export default class ClusteredApiServer implements Launchable {
  private port: number;
  private clusterDb = new Database();
  private instance: Launchable;

  constructor(port: number) {
    this.port = port;

    this.instance = cluster.isPrimary ? new LoadBalancer(this.port) : new ApiServer(this.port);
  }

  start() {
    if (cluster.isPrimary) {
      const maxWorkers = availableParallelism() - 1;

      if (maxWorkers < 1) {
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
    this.instance.start();
  }
}
