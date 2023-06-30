import { IDatabase, DatabaseMethod, sourceType } from './database';

export default class ClusterDatabase implements IDatabase {
  async selectAll(source: sourceType): Promise<unknown[]> {
    const stringifiedArgs = JSON.stringify([source]);
    const message = new DatabaseInquiryMessage('selectAll', stringifiedArgs);

    return new Promise((resolve, reject) => {
      process.send?.(message, undefined, undefined, (error) => error && reject(error));
      process.once('message', (message: string) => resolve(JSON.parse(message)));
    });
  }

  async selectOneById(source: sourceType, id: string): Promise<unknown> {
    const stringifiedArgs = JSON.stringify([source, id]);
    const message = new DatabaseInquiryMessage('selectOneById', stringifiedArgs);

    return new Promise((resolve, reject) => {
      process.send?.(message, undefined, undefined, (error) => error && reject(error));
      process.once('message', (message: string) => resolve(JSON.parse(message)));
    });
  }

  async create(source: sourceType, data: any): Promise<unknown> {
    const stringifiedArgs = JSON.stringify([source, data]);
    const message = new DatabaseInquiryMessage('create', stringifiedArgs);

    return new Promise((resolve, reject) => {
      process.send?.(message, undefined, undefined, (error) => error && reject(error));
      process.once('message', (message: string) => resolve(JSON.parse(message)));
    });
  }

  async updateById(source: sourceType, id: string, data: any): Promise<unknown> {
    const stringifiedArgs = JSON.stringify([source, id, data]);
    const message = new DatabaseInquiryMessage('updateById', stringifiedArgs);

    return new Promise((resolve, reject) => {
      process.send?.(message, undefined, undefined, (error) => error && reject(error));
      process.once('message', (message: string) => resolve(JSON.parse(message)));
    });
  }

  async deleteById(source: sourceType, id: string): Promise<true | null> {
    const stringifiedArgs = JSON.stringify([source, id]);
    const message = new DatabaseInquiryMessage('deleteById', stringifiedArgs);

    return new Promise((resolve, reject) => {
      process.send?.(message, undefined, undefined, (error) => error && reject(error));
      process.once('message', (message: string) => resolve(JSON.parse(message)));
    });
  }
}

export class DatabaseInquiryMessage {
  dbCall: { handler: DatabaseMethod; stringifiedArgs: string };

  constructor(handler: DatabaseMethod, stringifiedArgs: string) {
    this.dbCall = { handler, stringifiedArgs };
  }
}
