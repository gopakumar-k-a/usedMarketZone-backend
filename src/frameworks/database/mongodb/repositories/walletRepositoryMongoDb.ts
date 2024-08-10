import { Types } from "mongoose";
import { Wallet } from "../models/walletModel";
import { CreateWalletHistoryEntity } from "../../../../entities/createWalletHistoryEntity";
export const walletRepositoryMongoDb = () => {
  //   const toUser = await User.findById(toUserId);
  //   toUser.walletBalance += amount / 100; // Convert paise to rupees
  //   await toUser.save();

  const addAmountToUserWallet = async (
    userId: Types.ObjectId,
    AmountInPaise: number,
    historyEntity: CreateWalletHistoryEntity
  ) => {
    let toUserWallet = await Wallet.findOne({ userId });
    console.log("toUserWallet ", toUserWallet);

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

  // const addPaymentHistoryToUserWallet = async (
  //   userId: Types.ObjectId,
  //   historyEntity: CreateWalletHistoryEntity
  // ) => {
  //   let toUserWallet = await Wallet.findOne({ userId });
  //   console.log("toUserWallet ", toUserWallet);

  //   if (!toUserWallet) {
  //     toUserWallet = await Wallet.create({
  //       userId: userId,
  //     });
  //   }

  //   toUserWallet.walletHistory.push({
  //     productId: historyEntity.getProductId(),
  //     bidId: historyEntity.getBidId(),
  //     type: historyEntity.getType(),
  //   });

  //   await toUserWallet.save();
  // };

  const getUserWallet = async (userId: Types.ObjectId) => {
    // let userWallet = await Wallet.aggregate([
    //   { $match: { userId } },

    //   { $unwind: "$walletHistory" },
    //   {
    //     $lookup: {
    //       from: "products", // Assuming the collection name is 'products'
    //       localField: "walletHistory.productId",
    //       foreignField: "_id",
    //       as: "productDetails",
    //     },
    //   },
    //   {
    //     $unwind: { path: "$productDetails", preserveNullAndEmptyArrays: true },
    //   },
    //   {
    //     $project: {

    //       walletHistory:[ {
    //         productData: { productName: "$productDetails.productName",productId:'$productDetails._id' },
    //         type: "$walletHistory.type",
    //         amount: "$walletHistory.amount",
    //       }],
    //       userId: 1,
    //       walletBalance: 1,
    //     },
    //   },
    // ]);
    const wallet = await Wallet.findOne({ userId })
      .populate({
        path: "walletHistory.productId",
        select: "productName", // Replace with the fields you want to retrieve from Product
      })
      .populate({
        path: "walletHistory.bidId",
        select: "bidName", // Replace with the fields you want to retrieve from bid
      });
    // if (userWallet.length === 0) {
    //   const newWallet = await Wallet.create({ userId });
    //   return newWallet;
    // }

    // console.log("user wallet ", userWallet[0]);
    // console.log("user wallet productName", userWallet[0].WalletHistory);

    // return userWallet.length > 0 ? userWallet[0] : null;
    console.log("user wallet ", wallet);
    console.log(
      "wallet history ",
      wallet?.walletHistory ? wallet.walletHistory : null
    );

    return wallet;
  };
  return {
    addAmountToUserWallet,
    getUserWallet,
    // addPaymentHistoryToUserWallet,
  };
};

export type WalletRepositoryMongoDb = typeof walletRepositoryMongoDb;
