import { IRestaurant } from "../types/restaurant.type";
import mongoose, { Schema } from "mongoose";

const restrurantSchema: Schema<IRestaurant> = new Schema({
  name: { type: String },
  category: { type: String },
  acronym: { type: String, unique: true },
  country: { type: String },
  division: { type: String },
  district: { type: String },
  coverPhoto: { type: String },
  exectLocation: { type: String },
  isVerified: { type: Boolean, default: false },
  gitfCardTemplateIds: [{ type: String, ref: "GiftCardTemplate" }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Restaurant = mongoose.model<IRestaurant>(
  "Restaurant",
  restrurantSchema,
);
