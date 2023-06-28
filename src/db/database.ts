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
    const sourceArray = this.sourceData[source];

    return sourceArray;
  }

  async selectOneById(source: sourceType, id: string) {
    const sourceArray = this.sourceData[source];
    const selected = sourceArray.find((item) => item.id === id);

    return selected;
  }

  async create(source: sourceType, data: UserFromRequest): Promise<User> {
    const newUser = { id: randomUUID(), ...data };
    this.sourceData[source].push(newUser);

    return newUser;
  }
}
