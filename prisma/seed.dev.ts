/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const seeds = {
  user: {
    where: { email: '{email}' },
    items: [
      { email: 'admin@example.com', password: 'securepassword' },
      { email: 'support@example.com', password: 'securepassword' },
      { email: 'user@example.com', password: 'securepassword' },
    ],
  },
};

function replaceVariableInObject(obj: any, variables: { [key: string]: string }) {
  const str = JSON.stringify(obj);
  const replacedStr = str.replace(/{(\w+)}/g, (_, key) => variables[key as string] || `{${key}}`);
  return JSON.parse(replacedStr);
}

async function main() {
  // Add your seed data here
  for (const seed in seeds) {
    const key = seed as keyof typeof seeds;

    for (const item of seeds[key].items) {
      const where = replaceVariableInObject(seeds[seed as keyof typeof seeds].where, item as { [key: string]: string });

      // Upsert each item based on the unique 'where' condition
      await prisma[key].upsert({ where, update: item, create: item });
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
