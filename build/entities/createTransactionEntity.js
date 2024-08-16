"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTransactionEntity = void 0;
const mongoose_1 = require("mongoose");
const createTransactionEntity = (fromUserId, toUserId, amount, status, productId, bidId, transactionType = "credit") => {
    return {
        getFromUserId: () => new mongoose_1.Types.ObjectId(fromUserId),
        getToUserId: () => toUserId ? new mongoose_1.Types.ObjectId(toUserId) : null,
        getAmount: () => amount,
        getStatus: () => status,
        getTransactionType: () => transactionType,
        getProductId: () => productId,
        getBidId: () => bidId,
    };
};
exports.createTransactionEntity = createTransactionEntity;
