import mongoose from "mongoose";

const { Schema } = mongoose;

const purchaseSchema = new Schema({
  gitfCardId: { type: String, ref: "GiftCard" },
  salesId: { type: String, ref: "Sales" },
  amount: { type: Number },
});

export default mongoose.model("Purchase", purchaseSchema);
