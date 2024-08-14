import { Types } from "mongoose";
import { Wallet } from "../models/walletModel";
import { CreateWalletHistoryEntity } from "../../../../entities/createWalletHistoryEntity";
export const walletRepositoryMongoDb = () => {
  const addAmountToUserWallet = async (
    userId: Types.ObjectId,
    AmountInPaise: number,
    historyEntity: CreateWalletHistoryEntity
  ) => {
    let toUserWallet = await Wallet.findOne({ userId });

    if (!toUserWallet) {
      toUserWallet = await Wallet.create({
        userId: userId,
      });
    }

    toUserWallet.walletBalance += AmountInPaise / 100;
    toUserWallet.walletHistory.push({
      productId: historyEntity.getProductId(),
      bidId: historyEntity.getBidId(),
      amount: historyEntity.getAmount(),
      type: historyEntity.getType(),
    });

    await toUserWallet.save();

    return toUserWallet;
  };

  const getUserWallet = async (userId: Types.ObjectId) => {
    const wallet = await Wallet.findOne({ userId })
      .populate({
        path: "walletHistory.productId",
        select: "productName",
      })
      .populate({
        path: "walletHistory.bidId",
        select: "bidName",
      });

    return wallet;
  };
  return {
    addAmountToUserWallet,
    getUserWallet,
  };
};

export type WalletRepositoryMongoDb = typeof walletRepositoryMongoDb;
