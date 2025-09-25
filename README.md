# TypeScript NestJS API Template

_Written with the help of Github Copilot, I kept it simple without going into too much details and without adding too much fluff or unnecessary information._

- [Why I made these choices?](#why-i-made-these-choices)
  - [Use of NestJS](#use-of-nestjs)
    - [Advantages of NestJS](#advantages-of-nestjs)
    - [Why NestJS?](#why-nestjs)
  - [Use of Prisma](#use-of-prisma)
    - [Advantages of Prisma](#advantages-of-prisma)
    - [Why Prisma?](#why-prisma)
  - [Use of Fastify instead of ExpressJS](#use-of-fastify-instead-of-expressjs)

## Why I made these choices?

### Use of NestJS

NestJS is a Node.js framework for building server-side applications. It uses TypeScript and helps organize code with modules.

#### Advantages of NestJS

- **Modular**: Easy to organize and scale code.
- **Dependency Injection**: Simplifies managing dependencies.
- **TypeScript**: Catches errors early and improves code quality.
- **Built-in Features**: Routing, middleware, guards, and more.
- **Good Documentation**: Easy to find help and examples.

#### Why NestJS?

ExpressJS is flexible but requires a lot of setup. NestJS is built on top of Express (or Fastify) and provides structure, features, and TypeScript support out of the box, making development faster and easier.

### Use of Prisma

Prisma is an ORM for working with databases in Node.js. It generates a type-safe client from your database schema.

#### Advantages of Prisma

- **Type Safety**: Fewer runtime errors.
- **Easy Queries**: Simple API for database operations.
- **Migrations**: Easy to update database schema.
- **Supports Many Databases**: Works with PostgreSQL, MySQL, SQLite, and more.

#### Why Prisma?

Prisma is easier to use and set up than Sequelize. It reduces boilerplate, improves code quality, and makes managing database changes simple.

### Use of Fastify instead of ExpressJS

Fastify is a fast and efficient web framework. It uses less overhead and has a plugin system. We use Fastify instead of ExpressJS for better performance.

#### Advantages of Fastify

- **Performance**: Faster than ExpressJS.
- **Low Overhead**: Minimal impact on response times.
- **Schema-based Validation**: Built-in support for JSON schema validation.
- **Plugin System**: Easy to extend functionality.
- **Asynchronous**: Designed for async/await, improving performance.

#### Why Fastify?

Fastify offers better performance and lower overhead than ExpressJS. Its schema-based validation and plugin system make it a great choice for building efficient APIs.

## Available authentication methods

### Local (username/password) authentication

- **Endpoint**: `POST /auth/login`
- **Request Body**:

  ```json
  {
    "username": "your_username",
    "password": "your_password"
  }
  ```

- **Response**:

  ```json
  {
    "accessToken": "your_jwt_token"
  }
  ```

### JWT (JSON Web Token) authentication

- **Endpoint**: `POST /auth/profile`
- **Headers**:

  ```text
  Authorization: Bearer your_jwt_token
  ```
