import { Types } from "mongoose";
import { Wallet } from "../models/walletModel";
export const walletRepositoryMongoDb = () => {
  //   const toUser = await User.findById(toUserId);
  //   toUser.walletBalance += amount / 100; // Convert paise to rupees
  //   await toUser.save();

  const addAmountToUserWallet = async (
    userId: Types.ObjectId,
    AmountInPaise: number
  ) => {
    let toUserWallet = await Wallet.findOne({ userId });
    console.log("toUserWallet ", toUserWallet);

    if (!toUserWallet) {
      toUserWallet = await Wallet.create({
        userId: userId,
      });
    }

    toUserWallet.walletBalance += AmountInPaise / 100;

    await toUserWallet.save();

    return toUserWallet;
  };

  const getUserWallet = async (userId: Types.ObjectId) => {
    let userWallet = await Wallet.findOne({ userId });
    if (!userWallet) {
      userWallet = await Wallet.create({
        userId: userId,
      });
    }

    return userWallet;
  };
  return { addAmountToUserWallet ,getUserWallet};
};

export type WalletRepositoryMongoDb = typeof walletRepositoryMongoDb;
