import mongoose, { Schema, Document, model } from "mongoose";

interface IWallet extends Document{
    userId:mongoose.Types.ObjectId;
    walletBalance:number;
}

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
});

const Wallet = mongoose.model<IWallet>("Wallet", walletSchema);

export {IWallet,Wallet}
