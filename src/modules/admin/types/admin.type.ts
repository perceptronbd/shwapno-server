import { Permission } from "./permissions.type";
import { Role } from "./roles.type";
import { ObjectId } from "mongoose";

export interface IAdmin extends Document {
  _id: ObjectId;
  username: string;
  email: string;
  phone: string;
  password: string;
  roles: Role[];
  permission: Permission[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AdminWithTokens extends Partial<IAdmin> {
  accessToken: string;
  refreshToken: string;
}
