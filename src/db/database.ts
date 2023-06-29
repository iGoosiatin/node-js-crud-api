import { randomUUID } from 'crypto';

import { User, UserFromRequest } from '../types/users';
import USERS from './data';

type sourceType = 'users';

type sourceDataType = {
  users: User[];
};

export default class InMemoryDatabase {
  private sourceData: sourceDataType = { users: USERS };

  async selectAll(source: sourceType) {
    const itemsArray = this.sourceData[source];

    return itemsArray;
  }

  async selectOneById(source: sourceType, id: string) {
    const itemsArray = this.sourceData[source];
    const item = itemsArray.find((item) => item.id === id);

    return item;
  }

  async create(source: sourceType, data: UserFromRequest): Promise<User> {
    const newItem = { id: randomUUID(), ...data };
    this.sourceData[source].push(newItem);

    return newItem;
  }

  async updateById(source: sourceType, id: string, data: UserFromRequest): Promise<User | null> {
    const item = await this.selectOneById(source, id);
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
