import mongoose, { Schema, Document, Model } from "mongoose";

// Interface for bid duration
interface BidDuration {
  day: number;
  hour: number;
  minute: number;
}

// Interface for the product
export interface IProduct extends Document {
  productName: string;
  basePrice: number;
  userId: mongoose.Schema.Types.ObjectId;
  productImageUrls: string[];
  category: string;
  subCategory: string;
  phone: number;
  description: string;
  createdAt: Date;
  productCondition: string;
  productAge: string;
  address: string;
  bookmarkedUsers: mongoose.Schema.Types.ObjectId[];
  bookmarkedCount: number;
  isBlocked: boolean;
  isSold: boolean;
  isOtpVerified: boolean;
  postStatus: "draft" | "active" | "deactivated";
  isBidding: boolean;
  isAdminAccepted: boolean;
  bidAcceptedTime: Date;
  bidDuration: BidDuration;
  bidEndTime: Date;
  bidData:mongoose.Types.ObjectId;
}

// Schema definition for product
const productSchema: Schema = new Schema(
  {
    productName: {
      type: String,
      required: true,
    },
    basePrice: {
      type: Number,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productImageUrls: {
      type: [String],
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    subCategory: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: () => Date.now(),
    },
    productCondition: {
      type: String,
      required: true,
    },
    productAge: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    bookmarkedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    bookmarkedCount: {
      type: Number,
      default: 0,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    isSold: {
      type: Boolean,
      default: false,
    },
    isOtpVerified: {
      type: Boolean,
      default: false,
    },
    postStatus: {
      type: String,
      enum: ["draft", "active", "deactivated"],
      default: "draft",
    },
    isBidding: {
      type: Boolean,
      default: false,
    },
    isAdminAccepted: {
      type: Boolean,
      default: false,
    },
    bidAcceptedTime: {
      type: Date,
    },
    bidDuration: {
      day: { type: Number },
      hour: { type: Number },
      minute: { type: Number },
    },
    bidEndTime: {
      type: Date,
    },
    bidData:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'bid'
    }
  },
  {
    timestamps: true,
  }
);

// Create and export the model
const Product: Model<IProduct> = mongoose.model<IProduct>("Product", productSchema);
export default Product;
