import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const connectDB = async (): Promise<void> => {
  try {
    await prisma.$connect();
    console.log("Connected to the Database.");
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Failed to connect to PostgreSQL:", error.message);
    } else {
      console.error("Failed to connect to PostgreSQL:", error);
    }
    process.exit(1);
  }
};

export default prisma;
