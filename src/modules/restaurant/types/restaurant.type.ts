import { Document, ObjectId } from "mongoose";

export interface IRestaurant extends Document {
  _id: ObjectId;
  name: string;
  category: string;
  acronym: string;
  country: string;
  division: string;
  district: string;
  coverPhoto: string;
  exectLocation: string;
  isVerified: boolean;
  gitfCardTemplateIds: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
