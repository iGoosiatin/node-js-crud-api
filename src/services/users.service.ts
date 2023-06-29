import InMemoryDatabase from '../db/database';

export default class UsersService {
  db = new InMemoryDatabase();

  async getUsers() {
    const users = await this.db.selectAll('users');
    return users;
  }

  async getUser(id: string) {
    const user = await this.db.selectOneById('users', id);
    return user;
  }

  async createUser(username: string, age: number, hobbies: string[]) {
    const user = await this.db.create('users', { username, age, hobbies });
    return user;
  }

  async updateUser(id: string, username: string, age: number, hobbies: string[]) {
    const user = await this.db.updateById('users', id, { username, age, hobbies });
    return user;
  }

  async deleteUser(id: string) {
    const result = await this.db.deleteById('users', id);
    return result;
  }
}
