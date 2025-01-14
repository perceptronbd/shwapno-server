import { PERMISSIONS } from "@modules/admin/types/permissions.type";
import { IAdmin } from "@modules/admin/types/admin.type";
import { ROLES } from "@modules/admin/types/roles.type";
import { model, Schema } from "mongoose";

const AdminSchema: Schema<IAdmin> = new Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  phone: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  roles: {
    type: [String],
    enum: Object.values(ROLES),
    required: true,
  },
  permission: {
    type: [String],
    enum: Object.values(PERMISSIONS),
    required: true,
    default: [PERMISSIONS.VIEW_REPORTS],
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Admin = model<IAdmin>("Admin", AdminSchema);
