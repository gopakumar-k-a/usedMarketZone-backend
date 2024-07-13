import mongoose, { Document, Model, Schema, mongo } from "mongoose";
export interface IBidHistory extends Document {
  bidderId: mongoose.Types.ObjectId;
  bidAmount: number;
  bidTime: Date;
}
const bidHistorySchema: Schema = new Schema(
  {
    bidderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    bidData: {
      type: mongoose.Schema.Types.ObjectId,
      required: true, 
      ref: "bid",
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Product",
    },
    bidAmount: {
      type: Number,
      required: true,
    },
    bidTime: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

export const BidHistory: Model<IBidHistory> = mongoose.model<IBidHistory>(
  "bidHistory",
  bidHistorySchema
);
