import express, { Application } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

export const app: Application = express();

export default async function globalSetup() {
  // load environment variables
  dotenv.config({ path: ".env.test" });

  // Connect to express app
  console.log("Test Server is running on localhost:5000/api/v1");
  app.listen(5000, () => {
    console.log("Test Server is running on localhost:5000/api/v1");
  });

  console.log("Connecting to the database");
  await mongoose.connect(process.env.DATABASE_URL as string);
}
