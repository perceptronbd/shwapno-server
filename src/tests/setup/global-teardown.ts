import mongoose from "mongoose";

export default async function globalTeardown() {
  //clean up the database
  await mongoose.connection.dropDatabase();

  await mongoose.connection.close();
}
