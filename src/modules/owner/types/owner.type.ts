import { Document, ObjectId } from "mongoose";

export interface IOwner extends Document {
  _id: ObjectId;
  restrurantId: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  password: string;
  roles: string[];
  permission: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface OwnerWithTokens extends Partial<IOwner> {
  accessToken: string;
  refreshToken: string;
}
