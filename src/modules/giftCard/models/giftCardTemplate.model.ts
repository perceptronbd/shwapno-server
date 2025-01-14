import mongoose from "mongoose";

const { Schema } = mongoose;

const giftCardTemplateSchema = new Schema({
  restrurantId: { type: String, ref: "Restrurant" },
  name: { type: String },
  price: { type: Number },
  oriantation: { type: String, enum: ["vertical", "horizontal"] },
  businessLogo: { type: String },
  waterMark: { type: String },
  backgroundColor: { type: String },
  status: { type: String, enum: ["available", "unavailable"] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("GiftCardTemplate", giftCardTemplateSchema);
