# How to use Prisma ORM

This guide will help you set up and use Prisma ORM in your TypeScript NestJS API project.

## Step 1: Complete schema.prisma file

Make sure your `prisma/schema.prisma` file is properly configured. Here is an example schema:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## Step 2: Initialize Prisma schema

Run the following command to initialize your Prisma schema:

`npx prisma migrate dev --name init`

This command will create the necessary migration files and set up your database schema.

## Step 3: Generate Prisma Client

Generate the Prisma Client by running:

`npx prisma generate`

This command will create the Prisma Client in the `node_modules/@prisma/client` directory.
You can now import and use it in your application.

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
```
