import { withId } from '../types/common';
import { IDatabase, DatabaseMethod, sourceType } from './database';

export default class ClusterDatabase implements IDatabase {
  async selectAll<T>(source: sourceType): Promise<withId<T>[]> {
    const stringifiedArgs = JSON.stringify([source]);
    const message = new DatabaseInquiryMessage('selectAll', stringifiedArgs);

    return new Promise((resolve, reject) => {
      process.send?.(message, undefined, undefined, (error) => error && reject(error));
      process.once('message', (message: string) => resolve(JSON.parse(message)));
    });
  }

  async selectOneById<T>(source: sourceType, id: string): Promise<withId<T> | null> {
    const stringifiedArgs = JSON.stringify([source, id]);
    const message = new DatabaseInquiryMessage('selectOneById', stringifiedArgs);

    return new Promise((resolve, reject) => {
      process.send?.(message, undefined, undefined, (error) => error && reject(error));
      process.once('message', (message: string) => resolve(JSON.parse(message)));
    });
  }

  async create<T>(source: sourceType, data: T): Promise<withId<T>> {
    const stringifiedArgs = JSON.stringify([source, data]);
    const message = new DatabaseInquiryMessage('create', stringifiedArgs);

    return new Promise((resolve, reject) => {
      process.send?.(message, undefined, undefined, (error) => error && reject(error));
      process.once('message', (message: string) => resolve(JSON.parse(message)));
    });
  }

  async updateById<T>(source: sourceType, id: string, data: Partial<T>): Promise<withId<T> | null> {
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
