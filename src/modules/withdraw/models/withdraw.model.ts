import mongoose from "mongoose";

const { Schema } = mongoose;

const withdrawSchema = new Schema({
  restrurantId: { type: String, ref: "Restrurant" },
  ownerId: { type: String, ref: "Owner" },
  amount: { type: Number },
  status: { type: String, enum: ["pending", "approved", "rejected"] },
  requestedDate: { type: Date, default: Date.now },
  processedDate: { type: Date },
});

export default mongoose.model("Withdraw", withdrawSchema);
