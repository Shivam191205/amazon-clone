require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function reset() {
  console.log("Truncating database...");
  await prisma.$executeRawUnsafe('TRUNCATE TABLE users CASCADE;');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE categories CASCADE;');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE products CASCADE;');
  console.log("Database reset complete.");
}
reset().catch(console.error).finally(()=>prisma.$disconnect());
