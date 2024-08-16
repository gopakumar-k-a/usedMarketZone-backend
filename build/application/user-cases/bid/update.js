"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAddClaimerAddress = exports.handlePlaceBid = void 0;
const createBidHistory_1 = require("../../../entities/bidding/createBidHistory");
const appError_1 = __importDefault(require("../../../utils/appError"));
const httpStatusCodes_1 = require("../../../types/httpStatusCodes");
const mongoose_1 = __importStar(require("mongoose"));
const app_1 = require("../../../app");
const createBidClaimerAddress_1 = require("../../../entities/bidding/createBidClaimerAddress");
const handlePlaceBid = async (bidderId, bidProductId, bidAmount, bidRepositoryDb, bidHistoryRepositoryDb, kycRepositoryDb) => {
    console.log("Placing bid with:", { bidderId, bidProductId, bidAmount });
    const isKycVerified = await kycRepositoryDb.checkKycIsVerified(new mongoose_1.Types.ObjectId(bidderId));
    if (!isKycVerified) {
        throw new appError_1.default("Can't place bid, Update KYC in Settings Only KYC accepted by admin are allowed to place bid", httpStatusCodes_1.HttpStatusCodes.BAD_GATEWAY);
    }
    const bid = await bidRepositoryDb.getBidDetails(bidProductId);
    if (!bid) {
        throw new appError_1.default("Bid not found", httpStatusCodes_1.HttpStatusCodes.BAD_GATEWAY);
    }
    if (bidderId === String(bid.userId)) {
        throw new appError_1.default("Owner of the Bid is Not Allowed To Bid On Their Products", httpStatusCodes_1.HttpStatusCodes.BAD_REQUEST);
    }
    if (hasBidEnded(bid.bidEndTime)) {
        throw new appError_1.default("Cannot bid, the bid has ended", httpStatusCodes_1.HttpStatusCodes.BAD_REQUEST);
    }
    const currentDate = new Date(Date.now());
    const totalBidAmount = await calculateTotalBidAmount(bidAmount, bidderId, bidProductId, bidHistoryRepositoryDb);
    validateBidAmount(bid, totalBidAmount);
    const newBidHistoryEntity = (0, createBidHistory_1.createBidHistoryEntity)(bidderId, String(bid._id), bidProductId, bidAmount, currentDate);
    const newBidHistory = (await bidHistoryRepositoryDb.createNewBidHistory(newBidHistoryEntity));
    await updateBidDetails(bidRepositoryDb, newBidHistory._id, bid._id, totalBidAmount, bidderId);
    app_1.io.emit("newHighestBid", {
        bidProductId,
        highestBid: totalBidAmount,
    });
    return totalBidAmount;
};
exports.handlePlaceBid = handlePlaceBid;
const hasBidEnded = (endTime) => {
    const currentTime = new Date().getTime();
    return currentTime > endTime.getTime();
};
const calculateTotalBidAmount = async (bidAmount, bidderId, bidProductId, bidHistoryRepositoryDb) => {
    let totalBidAmount = parseInt(bidAmount);
    const previousBidSum = await bidHistoryRepositoryDb.getUserPreviousBidsSumOnProduct(new mongoose_1.default.Types.ObjectId(bidderId), new mongoose_1.default.Types.ObjectId(bidProductId));
    if (previousBidSum.length > 0) {
        totalBidAmount += previousBidSum[0].previousBidSumOfBidder;
    }
    return totalBidAmount;
};
const validateBidAmount = (bid, totalBidAmount) => {
    if (bid.bidHistory.length === 0 && bid.baseBidPrice >= totalBidAmount) {
        throw new appError_1.default(`Bid Amount Must be greater than Base Bid Price. Current base bid price is ${bid.baseBidPrice}`, httpStatusCodes_1.HttpStatusCodes.BAD_REQUEST);
    }
    if (totalBidAmount <= bid.currentHighestBid) {
        throw new appError_1.default(`Your bid must be higher than the current highest bid. Current highest bid is ${bid.currentHighestBid}`, httpStatusCodes_1.HttpStatusCodes.BAD_REQUEST);
    }
};
const updateBidDetails = async (bidRepositoryDb, newBidHistoryId, bidId, totalBidAmount, bidderId) => {
    await bidRepositoryDb.placeBid(newBidHistoryId, bidId, totalBidAmount, new mongoose_1.default.Types.ObjectId(bidderId));
};
const handleAddClaimerAddress = async (bidId, address, bidDb) => {
    const newAddressEntity = (0, createBidClaimerAddress_1.createBidClaimerAddressEntity)(address.country, address.state, address.district, address.city, address.postalCode, address.phone);
    const newAddress = await bidDb.addBidClaimerAddress(new mongoose_1.Types.ObjectId(bidId), newAddressEntity);
    return newAddress;
};
exports.handleAddClaimerAddress = handleAddClaimerAddress;
