"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBidHistoryEntity = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const createBidHistoryEntity = (bidderId, bidData, productId, bidAmount, bidTime) => {
    return {
        getBidderId: () => new mongoose_1.default.Types.ObjectId(bidderId),
        getBidData: () => new mongoose_1.default.Types.ObjectId(bidData),
        getProductId: () => new mongoose_1.default.Types.ObjectId(productId),
        getBidAmount: () => parseInt(bidAmount),
        getBidTime: () => bidTime,
    };
};
exports.createBidHistoryEntity = createBidHistoryEntity;
