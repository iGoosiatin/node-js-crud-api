# RSS NodeJS 2023 Q2
## Assignment: CRUD API
### Description

Implemented simple CRUD API using in-memory database underneath.

---
Notes and caveats:
- There is no POST/PUT body values trimming.
- Only type-specific validation is applied.
- PUT accepts partial schema. This was done on purpose to do validation and typing more challenging.
- Server won't start if you have duplicate routes.
- Server won't start in cluster mode if there is no available parallelism.
- In cluster mode, you can see which specific worker replied to request by checking "Responder" header in response.
- In cluster mode, load balancer acts as a simple proxy if you have only 1 worker.
---

## How to setup
- Pull this repo
- Make sure your node version is 18.16
- Install required packages
```
npm install
```
- Create `.env` and configure custom server port, if necessary. Otherwise, default port 4000 is set.
---

## How to use
### Start development
```
npm run start:dev
```
### Start development in cluster mode
```
npm run start:dev:multi
```
---
### Start production
```
npm run start:prod
```
### Start production in cluster mode
```
npm run start:prod:multi
```
---
### Run E2E tests
```
npm run test
```
---
## Environment variables
Possible variables
```
PORT={number}
```
---
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