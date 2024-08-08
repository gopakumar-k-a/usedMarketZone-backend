import mongoose, { Schema, Document, model, Types } from "mongoose";
interface WalletHistory {
  productId: Types.ObjectId | null;
  bidId: Types.ObjectId | null;
  amount: number;
  type: "debit" | "credit";
}
interface IWallet extends Document {
  userId: mongoose.Types.ObjectId;
  walletBalance: number;
  walletHistory: WalletHistory[];
}
const WalletHistorySchema = new Schema(
  {
    productId: {
      type: Types.ObjectId,
      ref: "Product",
      required: false,
    },
    bidId: {
      type: Types.ObjectId,
      ref: "bid",
      default: null,
      required: false,
    },
    type: {
      type: String,
      enum: ["debit", "credit"],
      default: "credit",
    },
    amount: {
      type: Number,
    },
  },
  { timestamps: true }
);

const walletSchema: Schema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    require: true,
    ref: "User",
  },
  walletBalance: {
    type: Number,
    default: 0,
  },
  walletHistory: { type: [WalletHistorySchema ], default: [] },
});

const Wallet = mongoose.model<IWallet>("Wallet", walletSchema);

export { IWallet, Wallet };
