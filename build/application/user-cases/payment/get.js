"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleGetTransactionHistoryUser = exports.handleGetUserWallet = void 0;
const mongoose_1 = require("mongoose");
const handleGetUserWallet = async (userId, walletDb) => {
    const wallet = await walletDb.getUserWallet(new mongoose_1.Types.ObjectId(userId));
    return wallet;
};
exports.handleGetUserWallet = handleGetUserWallet;
const handleGetTransactionHistoryUser = async (userId, transactionDb) => {
    const transactionHistory = await transactionDb.getTransactionHistoryUser(new mongoose_1.Types.ObjectId(userId));
    return transactionHistory;
};
exports.handleGetTransactionHistoryUser = handleGetTransactionHistoryUser;
