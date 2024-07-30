import mongoose, { Schema, Document, model } from "mongoose";

interface ITransaction extends Document {
  fromUserId: mongoose.Types.ObjectId;
  toUserId: mongoose.Types.ObjectId;
  amount: number;
  status: "captured" | "failed";
  transactionType: "debit" | "credit";
  createdAt: Date;
  updatedAt: Date;
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
      require: true,
      ref: "User",
    },
    amount: Number,
    status: String,
    transactionType: {
      type: String,
      default: "credit",
    },
  },
  { timestamps: true }
);

const Transaction = mongoose.model<ITransaction>(
  "Transaction",
  TransactionSchema
);
export { Transaction, ITransaction };
