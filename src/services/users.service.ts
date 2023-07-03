import Database from '../db';
import { User } from '../types/users';

export default class UsersService {
  db = new Database();

  async getUsers() {
    const users = await this.db.selectAll<User>('users');
    return users;
  }

  async getUser(id: string) {
    const user = await this.db.selectOneById<User>('users', id);
    return user;
  }

  async createUser(username: string, age: number, hobbies: string[]) {
    const user = await this.db.create('users', { username, age, hobbies });
    return user;
  }

  async updateUser(id: string, username?: string, age?: number, hobbies?: string[]) {
    const user = await this.db.updateById<User>('users', id, {
      ...(username && { username }),
      ...(age && { age }),
      ...(hobbies && { hobbies }),
    });
    return user;
  }

  async deleteUser(id: string) {
    const result = await this.db.deleteById('users', id);
    return result;
  }
}
