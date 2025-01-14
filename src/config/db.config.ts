import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL as string);

    console.log("Connected to the Database.");
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Failed to connect to MongoDB:", error.message);
    } else {
      console.error("Failed to connect to MongoDB:", error);
    }

    process.exit(1);
  }
};
