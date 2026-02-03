import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

// On va utiliser une méthode plus simple si la version 7 râle :
// Forcer la variable d'environnement au moment du runtime
process.env.DATABASE_URL = process.env.DATABASE_URL || "postgresql://admin:admin@db:5432/goal_tracker";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const globalPrisma = new PrismaClient({ adapter });

export default globalPrisma;