"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bidHistoryRepositoryMongoDb = void 0;
const bidHistoryModel_1 = require("../models/bidHistoryModel");
const bidHistoryRepositoryMongoDb = () => {
    const createNewBidHistory = async (createBidHistoryEntity) => {
        const newBidHistory = await bidHistoryModel_1.BidHistory.create({
            bidderId: createBidHistoryEntity.getBidderId(),
            bidAmount: createBidHistoryEntity.getBidAmount(),
            bidTime: createBidHistoryEntity.getBidTime(),
            bidData: createBidHistoryEntity.getBidData(),
            productId: createBidHistoryEntity.getProductId(),
        });
        return newBidHistory;
    };
    const getHighestBid = async (bidIds) => {
        const highestBidDetails = await bidHistoryModel_1.BidHistory.aggregate([
            { $match: { _id: { $in: bidIds } } },
            { $sort: { bidAmount: -1 } },
            { $limit: 1 },
        ]).exec();
        return highestBidDetails.length > 0 ? highestBidDetails[0] : null;
    };
    const getUserPreviousBidsSumOnProduct = async (bidderId, bidProductId) => {
        const previousBidSumOfUser = await bidHistoryModel_1.BidHistory.aggregate([
            {
                $match: {
                    productId: bidProductId,
                    bidderId: bidderId,
                },
            },
            {
                $group: {
                    _id: "$bidderId",
                    previousBidSumOfBidder: { $sum: "$bidAmount" },
                    bidDetails: { $push: "$$ROOT" },
                },
            },
            {
                $project: {
                    previousBidSumOfBidder: 1,
                },
            },
        ]);
        return previousBidSumOfUser;
    };
    const getUserBidHistoryOnProduct = async (userId, productId) => {
        const bidHistory = await bidHistoryModel_1.BidHistory.aggregate([
            {
                $match: {
                    bidderId: userId,
                    productId: productId,
                },
            },
            {
                $project: {
                    bidTime: 1,
                    bidAmount: 1,
                },
            },
        ]);
        return bidHistory;
    };
    const getProductBidHistoryAdmin = async (bidProductId) => {
        const bidHistory = await bidHistoryModel_1.BidHistory.aggregate([
            {
                $match: {
                    productId: bidProductId,
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "bidderId",
                    foreignField: "_id",
                    as: "bidderDetails",
                },
            },
            {
                $unwind: "$bidderDetails",
            },
            {
                $group: {
                    _id: "$bidderId",
                    bidderName: { $first: "$bidderDetails.userName" },
                    bids: {
                        $push: {
                            bidAmount: "$bidAmount",
                            bidTime: "$bidTime",
                        },
                    },
                    totalBidAmount: { $sum: "$bidAmount" },
                },
            },
            {
                $addFields: {
                    lastBidDate: {
                        $arrayElemAt: [
                            {
                                $map: {
                                    input: { $reverseArray: "$bids" },
                                    as: "bid",
                                    in: "$$bid.bidTime",
                                },
                            },
                            0,
                        ],
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    bidderId: "$_id",
                    bidderName: 1,
                    bids: 1,
                    totalBidAmount: 1,
                    lastBidDate: 1,
                },
            },
            {
                $sort: { lastBidDate: -1 },
            },
        ]);
        console.log("bidHistory ", bidHistory);
        return bidHistory;
    };
    const getBidParticipents = async (bidWinnerId, productId) => {
        const bidParticipents = await bidHistoryModel_1.BidHistory.aggregate([
            {
                $match: {
                    bidderId: { $ne: bidWinnerId },
                    productId: productId,
                },
            },
            {
                $group: {
                    _id: null,
                    bidders: { $addToSet: "$bidderId" },
                },
            },
        ]);
        const formattedResult = bidParticipents.length > 0 ? bidParticipents[0].bidders : [];
        return formattedResult;
    };
    const getUserParticipatingBids = async (userId) => {
        const userBids = await bidHistoryModel_1.BidHistory.aggregate([
            {
                $match: {
                    bidderId: userId,
                },
            },
            {
                $lookup: {
                    from: "products",
                    localField: "productId",
                    foreignField: "_id",
                    as: "productData",
                },
            },
            {
                $unwind: "$productData",
            },
            {
                $lookup: {
                    from: "bids",
                    localField: "productId",
                    foreignField: "productId",
                    as: "bidData",
                },
            },
            {
                $unwind: "$bidData",
            },
            {
                $group: {
                    _id: {
                        productId: "$productId",
                        userId: "$bidderId",
                    },
                    totalBidAmount: {
                        $sum: "$bidAmount",
                    },
                    productData: {
                        $first: "$productData",
                    },
                    bidData: {
                        $first: "$bidData",
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    productId: "$_id.productId",
                    userId: "$bidData.userId",
                    totalBidAmount: 1,
                    productName: "$productData.productName",
                    productBasePrice: "$productData.basePrice",
                    productImageUrls: "$productData.productImageUrls",
                    isMyHighestBid: {
                        $eq: ["$bidData.highestBidderId", userId],
                    },
                    highestBidAmount: "$bidData.currentHighestBid",
                    isBidEnded: {
                        $lt: [Date.now(), "$bidData.bidEndTime"],
                    },
                    isBidAmountPaid: "$bidData.isBidAmountPaid",
                    claimedUserId: "$bidData.claimedUserId",
                },
            },
        ]);
        return userBids;
    };
    const getClaimableBidDetails = async (userId, productId) => {
        const userBid = await bidHistoryModel_1.BidHistory.aggregate([
            {
                $match: {
                    bidderId: userId,
                    productId: productId,
                },
            },
            {
                $lookup: {
                    from: "products",
                    localField: "productId",
                    foreignField: "_id",
                    as: "productData",
                },
            },
            {
                $unwind: "$productData",
            },
            {
                $lookup: {
                    from: "bids",
                    localField: "productId",
                    foreignField: "productId",
                    as: "bidData",
                },
            },
            {
                $unwind: "$bidData",
            },
            {
                $lookup: {
                    from: "transactions",
                    localField: "bidData.transactionId",
                    foreignField: "_id",
                    as: "transactionData",
                },
            },
            {
                $unwind: {
                    path: "$transactionData",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "users",
                    let: { productUserId: "$productData.userId" },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$_id", "$$productUserId"] } } },
                    ],
                    as: "userData",
                },
            },
            {
                $unwind: "$userData",
            },
            {
                $group: {
                    _id: {
                        productId: "$productId",
                        userId: "$bidderId",
                    },
                    totalBidAmount: {
                        $sum: "$bidAmount",
                    },
                    productData: {
                        $first: "$productData",
                    },
                    bidData: {
                        $first: "$bidData",
                    },
                    userData: {
                        $first: "$userData",
                    },
                    transactionData: {
                        $first: "$transactionData",
                    },
                },
            },
            {
                $addFields: {
                    productId: "$_id.productId",
                    userId: "$_id.userId",
                    productName: "$productData.productName",
                    productBasePrice: "$productData.basePrice",
                    productImageUrls: "$productData.productImageUrls",
                    isMyHighestBid: {
                        $eq: ["$bidData.highestBidderId", userId],
                    },
                    highestBidAmount: "$bidData.currentHighestBid",
                    isBidEnded: {
                        $lt: [new Date(), "$bidData.bidEndTime"],
                    },
                    isBidAmountPaid: "$bidData.isBidAmountPaid",
                    claimedUserId: "$bidData.claimedUserId",
                    bidId: "$bidData._id",
                    description: "$bidData.description",
                    isClaimerAddressAdded: "$bidData.isClaimerAddressAdded",
                    claimerAddress: "$bidData.claimerAddress",
                    ownerData: {
                        imageUrl: "$userData.imageUrl",
                        userName: "$userData.userName",
                        _id: "$userData._id",
                        firstName: "$userData.firstName",
                        lastName: "$userData.lastName",
                    },
                    transactionData: {
                        shipmentStatus: "$transactionData.shipmentStatus",
                        status: "$transactionData.status",
                    },
                    transactionId: "$bidData.transactionId",
                },
            },
            {
                $project: {
                    _id: 0,
                    productId: 1,
                    userId: 1,
                    totalBidAmount: 1,
                    productName: 1,
                    productBasePrice: 1,
                    productImageUrls: 1,
                    isMyHighestBid: 1,
                    highestBidAmount: 1,
                    isBidEnded: 1,
                    isBidAmountPaid: 1,
                    claimedUserId: 1,
                    bidId: 1,
                    description: 1,
                    isClaimerAddressAdded: 1,
                    claimerAddress: 1,
                    ownerData: 1,
                    transactionData: 1,
                    transactionId: 1,
                },
            },
        ]);
        return userBid && userBid.length > 0 ? userBid[0] : null;
    };
    return {
        createNewBidHistory,
        getHighestBid,
        getUserPreviousBidsSumOnProduct,
        getUserBidHistoryOnProduct,
        getProductBidHistoryAdmin,
        getBidParticipents,
        getUserParticipatingBids,
        getClaimableBidDetails,
    };
};
exports.bidHistoryRepositoryMongoDb = bidHistoryRepositoryMongoDb;
