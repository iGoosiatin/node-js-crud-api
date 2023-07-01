import supertest from 'supertest';
import ApiServer from '../src/apiServer';

const { server } = new ApiServer(4000);
const API_URL = '/api/users';
const id = '5e9e1afa-1ecd-433a-ad13-1e075f11bdd7';

describe('fail path', () => {
  test('Server returns error on non-existing endpoint', async () => {
    const {
      statusCode,
      body: { message },
    } = await supertest(server).get('/api/cars');

    expect(statusCode).toBe(404);
    expect(message).toEqual('Endpoint does not exist');
  });

  test('Server returns error on malformed request', async () => {
    const {
      statusCode,
      body: { message },
    } = await supertest(server).post(API_URL).send('');

    expect(statusCode).toBe(400);
    expect(message).toEqual('Bad request');
  });

  test('Server returns error non existing user', async () => {
    const {
      statusCode,
      body: { message },
    } = await supertest(server).get(`${API_URL}/${id}`);

    expect(statusCode).toBe(404);
    expect(message).toEqual('User does not exist');
  });

  test('User validation: detect missing prop "username"', async () => {
    const newIncompleteUser = {
      //username: 'test bot',
      age: 0,
      hobbies: [],
    };

    const {
      statusCode,
      body: { message },
    } = await supertest(server).post(API_URL).send(JSON.stringify(newIncompleteUser));

    expect(statusCode).toBe(400);
    expect(message).toStrictEqual('username is required');
  });

  test('User validation: detect missing prop "age"', async () => {
    const newIncompleteUser = {
      username: 'test bot',
      //age: 0,
      hobbies: [],
    };

    const {
      statusCode,
      body: { message },
    } = await supertest(server).post(API_URL).send(JSON.stringify(newIncompleteUser));

    expect(statusCode).toBe(400);
    expect(message).toStrictEqual('age is required');
  });

  test('User validation: detect missing prop "hobbies"', async () => {
    const newIncompleteUser = {
      username: 'test bot',
      age: 0,
      //hobbies: [],
    };

    const {
      statusCode,
      body: { message },
    } = await supertest(server).post(API_URL).send(JSON.stringify(newIncompleteUser));

    expect(statusCode).toBe(400);
    expect(message).toStrictEqual('hobbies is required');
  });

  test('User validation: invalid username', async () => {
    const newIncompleteUser = {
      username: 10,
      age: 0,
      hobbies: [],
    };

    const {
      statusCode,
      body: { message },
    } = await supertest(server).post(API_URL).send(JSON.stringify(newIncompleteUser));

    expect(statusCode).toBe(400);
    expect(message).toStrictEqual('username should be string');
  });

  test('User validation: invalid age', async () => {
    const newIncompleteUser = {
      username: 'test bot',
      age: '1',
      hobbies: [],
    };

    const {
      statusCode,
      body: { message },
    } = await supertest(server).post(API_URL).send(JSON.stringify(newIncompleteUser));

    expect(statusCode).toBe(400);
    expect(message).toStrictEqual('age should be number');
  });

  test('User validation: invalid hobbies', async () => {
    const newIncompleteUser = {
      username: 'test bot',
      age: 1,
      hobbies: 'hobby',
    };

    const {
      statusCode,
      body: { message },
    } = await supertest(server).post(API_URL).send(JSON.stringify(newIncompleteUser));

    expect(statusCode).toBe(400);
    expect(message).toStrictEqual('hobbies should be array');
  });

  test('User validation: invalid hobbies 2', async () => {
    const newIncompleteUser = {
      username: 'test bot',
      age: 1,
      hobbies: ['hobby 1', 2],
    };

    const {
      statusCode,
      body: { message },
    } = await supertest(server).post(API_URL).send(JSON.stringify(newIncompleteUser));

    expect(statusCode).toBe(400);
    expect(message).toStrictEqual('hobbies should contain only strings');
  });

  test('ID validation', async () => {
    const invalidId = 'non-uuid-id';
    const {
      statusCode,
      body: { message },
    } = await supertest(server).get(`${API_URL}/${invalidId}`);

    expect(statusCode).toBe(400);
    expect(message).toStrictEqual('id should be proper UUID');
  });
});
