import mongoose from "mongoose";

const { Schema } = mongoose;

const salesSchema = new Schema({
  purchaseId: { type: String, ref: "Purchase" },
  restrurantId: { type: String, ref: "Restrurant" },
  amount: { type: Number },
  date: { type: Date, default: Date.now },
});

export default mongoose.model("Sales", salesSchema);
