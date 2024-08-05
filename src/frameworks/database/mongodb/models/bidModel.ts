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
  isBidAmountPaid: boolean;
  claimedUserId: mongoose.Types.ObjectId;
  isClaimerAddressAdded: boolean;
  claimerAddress: {
    country: String;
    state: String;
    district: String;
    city: String;
    postalCode: String;
    phone: string;
  };
  transactionId: mongoose.Types.ObjectId;
  isBiddingEnded: boolean;
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
        default: [],
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
    isBidAmountPaid: {
      type: Boolean,
      default: false,
    },
    claimedUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    isClaimerAddressAdded: {
      type: Boolean,
      default: false,
    },
    claimerAddress: {
      country: {
        type: String,
      },
      state: {
        type: String,
      },
      district: {
        type: String,
      },
      city: {
        type: String,
      },
      postalCode: {
        type: String,
      },
      phone: {
        type: String,
      },
    },
    transactionId: {
      type: mongoose.Types.ObjectId,
      ref: "Transaction",
    },
    isBiddingEnded: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Bid: Model<IBid> = mongoose.model<IBid>("bid", bidSchema);
