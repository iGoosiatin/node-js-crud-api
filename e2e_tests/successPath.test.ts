import supertest from 'supertest';
import SimpleCrudServer from '../src/server';

const { server } = new SimpleCrudServer(4000);
const API_URL = '/api/users';

describe('success path', () => {
  let userId: string;

  test('In-memory DB has no users', async () => {
    const { statusCode, body: users } = await supertest(server).get(API_URL);

    expect(statusCode).toBe(200);
    expect(users).toEqual([]);
  });

  test('Creation of user', async () => {
    const newUser = {
      username: 'test bot',
      age: 0,
      hobbies: ['hacking'],
    };

    const {
      statusCode,
      body: { id, ...newUserData },
    } = await supertest(server).post(API_URL).send(JSON.stringify(newUser));

    expect(statusCode).toBe(201);
    expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
    expect(newUserData).toStrictEqual(newUser);

    userId = id;
  });

  test('In-memory DB contains created user', async () => {
    const { statusCode, body: users } = await supertest(server).get(API_URL);

    expect(statusCode).toBe(200);
    expect(users.length).toEqual(1);
  });

  test('Get user by id', async () => {
    const { statusCode, body: user } = await supertest(server).get(`${API_URL}/${userId}`);

    expect(statusCode).toBe(200);
    expect(user.id).toEqual(userId);
  });

  test('Update user data', async () => {
    const updateUser = {
      username: 'test bot 2',
      age: 1,
      hobbies: ['testing'],
    };

    const { statusCode, body: updatedUserData } = await supertest(server)
      .put(`${API_URL}/${userId}`)
      .send(JSON.stringify(updateUser));

    expect(statusCode).toBe(200);
    expect(updatedUserData).toStrictEqual({ id: userId, ...updateUser });
  });

  test('Delete user', async () => {
    const { statusCode } = await supertest(server).delete(`${API_URL}/${userId}`);

    expect(statusCode).toBe(204);
  });

  test('In-memory DB has no users', async () => {
    const { statusCode, body: users } = await supertest(server).get(API_URL);

    expect(statusCode).toBe(200);
    expect(users).toEqual([]);
  });
});
