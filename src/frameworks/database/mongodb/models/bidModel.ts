import mongoose, { Document, Model, Schema, mongo } from "mongoose";
import { IProduct } from "./productModel";

export interface IBid extends Document {
  _id: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  baseBidPrice: number;
  currentHighestBid: number;
  bidEndTime: Date;
  bidHistory: mongoose.Types.ObjectId[];
  isAdminVerified: boolean;
  biddingStatus: string;
  highestBidderId: mongoose.Types.ObjectId;
  highestBidderHistoryId: mongoose.Types.ObjectId;
  productData: IProduct;
}

const bidSchema: Schema = new Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Post",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    baseBidPrice: {
      type: Number,
      required: true,
    },
    currentHighestBid: {
      type: Number,
      default: 0,
      required: true,
    },
    bidEndTime: {
      type: Date,
      required: true,
    },
    bidHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BidHistory",
        default:[]
      },
    ],
    highestBidderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    highestBidderHistoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bidhistory",
    },
    isAdminVerified: {
      type: Boolean,
      default: true,
    },
    biddingStatus: {
      type: String,
      enum: ["active", "completed"],
      default: "active",
    },
  },
  { timestamps: true }
);

export const Bid: Model<IBid> = mongoose.model<IBid>("bid", bidSchema);
