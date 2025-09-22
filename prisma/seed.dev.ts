import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const seeds = {
    user: {
      items: [
        { email: 'admin@example.com', password: await bcrypt.hash('securepassword', 10) },
        { email: 'support@example.com', password: await bcrypt.hash('securepassword', 10) },
        { email: 'user@example.com', password: await bcrypt.hash('securepassword', 10) },
      ],
    },
  };

  // Add your seed data here
  for (const seed in seeds) {
    const key = seed as keyof typeof seeds;

    await prisma[key].createMany({
      data: seeds[key].items,
      skipDuplicates: true,
    });
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
