import { randomUUID } from 'crypto';

import { IDatabase, sourceType } from './database';

import USERS from './data';
import { idType, withId } from '../types/common';

type sourceDataType = {
  [key in sourceType]: idType[];
};
export default class InMemoryDatabase implements IDatabase {
  private sourceData: sourceDataType = { users: USERS };

  async selectAll<T>(source: sourceType): Promise<withId<T>[]> {
    const itemsArray = this.sourceData[source];

    return itemsArray as withId<T>[];
  }

  async selectOneById<T>(source: sourceType, id: string): Promise<withId<T> | null> {
    const itemsArray = this.sourceData[source];
    const item = itemsArray.find((item: { id: string }) => item.id === id);

    return (item as withId<T>) || null;
  }

  async create<T>(source: sourceType, data: T): Promise<withId<T>> {
    const newItem = { id: randomUUID(), ...data };
    this.sourceData[source].push(newItem);

    return newItem;
  }

  async updateById<T>(source: sourceType, id: string, data: Partial<T>): Promise<withId<T> | null> {
    const item = await this.selectOneById<T>(source, id);
    if (!item) {
      return null;
    }

    const updatedItem = { ...item, ...data };
    this.sourceData[source] = this.sourceData[source].map((item) => (item.id === id ? updatedItem : item));
    return updatedItem;
  }

  async deleteById(source: sourceType, id: string): Promise<true | null> {
    const item = await this.selectOneById(source, id);
    if (!item) {
      return null;
    }

    this.sourceData[source] = this.sourceData[source].filter((item) => item.id !== id);
    return true;
  }
}
