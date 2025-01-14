import mongoose from "mongoose";

const { Schema } = mongoose;

const giftCardSchema = new Schema({
  gitfCardTemplateId: { type: String, ref: "GiftCardTemplate" },
  code: { type: String },
  balance: { type: Number },
  redeemed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("GiftCard", giftCardSchema);
