"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.walletRepositoryMongoDb = void 0;
const walletModel_1 = require("../models/walletModel");
const walletRepositoryMongoDb = () => {
    const addAmountToUserWallet = async (userId, AmountInPaise, historyEntity) => {
        let toUserWallet = await walletModel_1.Wallet.findOne({ userId });
        if (!toUserWallet) {
            toUserWallet = await walletModel_1.Wallet.create({
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
    const getUserWallet = async (userId) => {
        const wallet = await walletModel_1.Wallet.findOne({ userId })
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
exports.walletRepositoryMongoDb = walletRepositoryMongoDb;
