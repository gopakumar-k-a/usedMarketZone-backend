import mongoose, { Schema } from "mongoose";

// Normal Product Schema
const productSchema: Schema = new mongoose.Schema(
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
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
