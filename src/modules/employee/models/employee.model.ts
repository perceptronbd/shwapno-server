import mongoose from "mongoose";

const { Schema } = mongoose;

const employeeSchema = new Schema({
  restrurantId: { type: String, ref: "Restrurant" },
  firstname: { type: String, required: true },
  lastname: { type: String },
  email: { type: String, unique: true },
  phone: { type: String, unique: true },
  password: { type: String, required: true },
  roles: { type: [String], enum: ["employee", "admin"] },
  permission: {
    type: [String],
    enum: [
      "all",
      "manage_restaurants",
      "view_reports",
      "redeem_cards",
      "assist_customers",
    ],
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Employee = mongoose.model("Employee", employeeSchema);
