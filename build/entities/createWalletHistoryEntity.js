"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWalletHistoryEntity = void 0;
const mongoose_1 = require("mongoose");
const createWalletHistoryEntity = (productId, bidId, amount, type = "credit") => {
    return {
        getProductId: () => productId ? new mongoose_1.Types.ObjectId(productId) : null,
        getBidId: () => bidId ? new mongoose_1.Types.ObjectId(bidId) : null,
        getType: () => type,
        getAmount: () => amount,
    };
};
exports.createWalletHistoryEntity = createWalletHistoryEntity;
