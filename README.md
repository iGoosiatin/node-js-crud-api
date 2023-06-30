# RSS NodeJS 2023 Q2
## Assignment: CRUD API
### Description

Implemented simple CRUD API using in-memory database underneath.

## How to setup
- Pull this repo
- Make sure your node version is 18.16
- Install required packages
```
npm install
```
- Create `.env` and configure custom server port, if necessary. Otherwise, default port 4000 is set.

## How to use
### Start development
```
npm run start:dev
```
### Start development in cluster mode
```
npm run start:dev:cluster
```
### Start production
```
npm run start:prod
```
### Start production in cluster mode
```
npm run start:prod:cluster
```

### Run E2E tests
```
npm run test
```

## Environment variables
Possible variables
```
PORT={number}
```

## Endpoints
### Get all users
```
GET /api/users
```
### Get user by ID
```
GET /api/users/:id
@params :id - UUID
```
### Create user
```
POST /api/users
@body
{
  username: string, required
  age: number, required
  hobbies: string[], required
}
```
### Update user by ID
```
PUT /api/users/:id
@params :id - UUID
@body
# At least one property should be provided
{
  username: string, optional
  age: number, optional
  hobbies: string[], optional
}
```
### Delete user by ID
```
DELETE /api/users/:id
@params :id - UUID
```