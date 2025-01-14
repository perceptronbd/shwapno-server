/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";

export const cleanupDatabase = async (models: mongoose.Model<any>[]) => {
  await Promise.all(models.map((model) => model.deleteMany({})));
};
