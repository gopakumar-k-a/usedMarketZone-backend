import mongoose, { Schema, Document, model } from "mongoose";

interface ITransaction extends Document {
  fromUserId: mongoose.Types.ObjectId;
  toUserId: mongoose.Types.ObjectId | null;
  amount: number;
  status: "captured" | "failed" | "escrow" | "released";
  transactionType: "debit" | "credit";
  createdAt: Date;
  updatedAt: Date;
  productId: mongoose.Types.ObjectId;
  bidId: mongoose.Types.ObjectId;
  shipmentStatus:
    | "not_shipped"
    | "shipped_to_admin"
    | "received_by_admin"
    | "shipped_to_buyer"
    | "delivered";
    trackingNumbers: {
      shippedToAdminTrackingNumber: string;
      shippedToBuyerTrackingNumber: string;
    };
}

const TransactionSchema: Schema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: "User",
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    amount: Number,
    status: {
      type: String,
      required: true,
      enum: ["captured", "failed", "escrow", "released"],
      default: "escrow",
    },
    transactionType: {
      type: String,
      default: "credit",
    },
    shipmentStatus: {
      type: String,
      enum: [
        "not_shipped",
        "shipped_to_admin",
        "received_by_admin",
        "shipped_to_buyer",
        "delivered",
      ],
      default: "not_shipped",
    },
    trackingNumbers: {
      shippedToAdminTrackingNumber: {
        type: String,
        default: null,
      },
      shippedToBuyerTrackingNumber: {
        type: String,
        default: null,
      },
    },
    
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Products",
    },
    bidId: {
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  { timestamps: true }
);

const Transaction = mongoose.model<ITransaction>(
  "Transaction",
  TransactionSchema
);
export { Transaction, ITransaction };
