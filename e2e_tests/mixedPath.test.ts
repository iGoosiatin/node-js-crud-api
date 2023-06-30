import supertest from 'supertest';
import SimpleCrudServer from '../src/server';
import { User } from 'types/users';

const { server } = new SimpleCrudServer(4000);
const API_URL = '/api/users';

describe('mixed path', () => {
  let user: User;

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

    user = { id, ...newUserData };
  });

  test('Unsuccessful update', async () => {
    const newDetails = {
      username: 'test bot',
      age: '1',
      hobbies: ['hacking'],
    };

    const {
      statusCode,
      body: { message },
    } = await supertest(server).put(`${API_URL}/${user.id}`).send(JSON.stringify(newDetails));

    expect(statusCode).toBe(400);
    expect(message).toBe('age should be number');
  });

  test('User was not updated', async () => {
    const { statusCode, body: userFromRes } = await supertest(server).get(`${API_URL}/${user.id}`);

    expect(statusCode).toBe(200);
    expect(userFromRes).toStrictEqual(user);
  });

  test('Creation of other user', async () => {
    const {
      statusCode,
      body: { id },
    } = await supertest(server).post(API_URL).send(JSON.stringify(user));

    expect(statusCode).toBe(201);
    expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
    expect(id).not.toBe(user.id);
  });
});
