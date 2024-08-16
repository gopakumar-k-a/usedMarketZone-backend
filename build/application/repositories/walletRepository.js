"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.walletRepository = void 0;
const walletRepository = (repository) => {
    const addAmountToUserWallet = async (userId, amountInPaise, historyEntity) => await repository.addAmountToUserWallet(userId, amountInPaise, historyEntity);
    const getUserWallet = async (userId) => await repository.getUserWallet(userId);
    return {
        addAmountToUserWallet,
        getUserWallet,
    };
};
exports.walletRepository = walletRepository;
