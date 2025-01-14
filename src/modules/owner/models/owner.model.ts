import { PERMISSIONS } from "@modules/owner/types/permissions.type";
import { IOwner } from "@modules/owner/types/owner.type";
import { ROLES } from "@modules/owner/types/roles.type";
import { model, Schema } from "mongoose";

const ownerSchema: Schema<IOwner> = new Schema({
  restrurantId: { type: String, ref: "Restrurant" },
  firstname: { type: String },
  lastname: { type: String },
  email: { type: String, unique: true },
  phone: { type: String, unique: true },
  password: { type: String },
  roles: { type: [String], enum: Object.values(ROLES), default: [ROLES.OWNER] },
  permission: {
    type: [String],
    enum: Object.values(PERMISSIONS),
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Owner = model<IOwner>("Owner", ownerSchema);
