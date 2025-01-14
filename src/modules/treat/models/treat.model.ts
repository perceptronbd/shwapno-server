import mongoose from "mongoose";

const { Schema } = mongoose;

const treatSchema = new Schema({
  senderId: { type: String, ref: "User" },
  purchaseId: { type: String, ref: "Purchase" },
  recieverName: { type: String },
  recieverEmail: { type: String },
  recieverPhone: { type: String },
  amount: { type: Number },
  balance: { type: Number },
  message: { type: String },
  redeemed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Treat", treatSchema);
