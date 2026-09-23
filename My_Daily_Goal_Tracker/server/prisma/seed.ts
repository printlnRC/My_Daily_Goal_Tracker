import prisma from '../src/lib/prisma.js';
import bcrypt from 'bcrypt';

async function main() {
  const email = 'admin@goaltracker.local';
  const password = 'admin123';

  const existing = await prisma.user.findUnique({
    where: { email }
  });

  if (!existing) {
    await prisma.user.create({
      data: {
        email,
        password: await bcrypt.hash(password, 10),
      }
    });

    console.log('✅ Utilisateur par défaut créé');
  } else {
    console.log('ℹ️ L’utilisateur par défaut existe déjà');
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });