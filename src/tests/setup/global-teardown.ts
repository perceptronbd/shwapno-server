import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function globalTeardown() {
  try {
    //clean up the database
    await prisma.$disconnect();
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    process.exit(1);
  }
}
