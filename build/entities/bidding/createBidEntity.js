"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBidEntity = void 0;
const createBidEntity = (productId, userId, baseBidPrice, bidEndTime) => {
    return {
        getProductId: () => productId,
        getUserId: () => userId,
        getBaseBidPrice: () => parseInt(baseBidPrice),
        getBidEndTime: () => new Date(bidEndTime),
    };
};
exports.createBidEntity = createBidEntity;
