import { UserFromRequest } from 'types/users';
import InMemoryDatabase from '../db/database';

export default class UsersModel {
  db = new InMemoryDatabase();

  async getUsers() {
    const users = await this.db.selectAll('users');
    return users;
  }

  async getUser(id: string) {
    const user = await this.db.selectOneById('users', id);
    return user;
  }

  async createUser(newUser: UserFromRequest) {
    const user = await this.db.create('users', newUser);
    return user;
  }
}
