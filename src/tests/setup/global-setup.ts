import express, { Application } from "express";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

const prisma = new PrismaClient();

export const app: Application = express();

export default async function globalSetup() {
  try {
    // load environment variables
    dotenv.config({ path: ".env.test" });

    // Connect to express app
    console.log("Test Server is running on localhost:5007/api/v1");
    app.listen(5007, () => {
      console.log("Test Server is running on localhost:5007/api/v1");
    });

    console.log("Connecting to the database");
    await prisma.$connect();
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    process.exit(1);
  }
}
