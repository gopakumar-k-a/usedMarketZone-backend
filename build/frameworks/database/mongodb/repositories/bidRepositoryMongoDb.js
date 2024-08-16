"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bidRepositoryMongoDb = void 0;
const bidModel_1 = require("../models/bidModel");
const appError_1 = __importDefault(require("../../../../utils/appError"));
const httpStatusCodes_1 = require("../../../../types/httpStatusCodes");
const bidRepositoryMongoDb = () => {
    const addBidAfterAdminAccept = async (createBidEntity) => {
        const createdBid = await bidModel_1.Bid.create({
            productId: createBidEntity.getProductId(),
            userId: createBidEntity.getUserId(),
            baseBidPrice: createBidEntity.getBaseBidPrice(),
            bidEndTime: createBidEntity.getBidEndTime(),
        });
        return createdBid;
    };
    const getBidDetails = async (productId) => {
        const bidData = await bidModel_1.Bid.findOne({ productId });
        if (!bidData) {
            throw new appError_1.default("invalid product id ", httpStatusCodes_1.HttpStatusCodes.BAD_GATEWAY);
        }
        return bidData;
    };
    const getHighestBidderDetails = async (productId) => {
        const bidProduct = await bidModel_1.Bid.findOne({ productId });
        if (!bidProduct) {
            throw new appError_1.default("no bid product found please check product id ", httpStatusCodes_1.HttpStatusCodes.BAD_GATEWAY);
        }
        return bidProduct.highestBidderId ? bidProduct.highestBidderId : false;
    };
    const getBidById = async (bidId) => {
        const bid = await bidModel_1.Bid.findById(bidId);
        if (!bid) {
            throw new appError_1.default("invalid product id ", httpStatusCodes_1.HttpStatusCodes.BAD_GATEWAY);
        }
        return bid;
    };
    const updateBid = async (bidId, update) => {
        const updatedBid = await bidModel_1.Bid.findByIdAndUpdate(bidId, update, {
            new: true,
        });
        return updatedBid;
    };
    const placeBid = async (bidHistoryId, bidId, currentHighestBid, highestBidderId) => {
        const updatedBid = await bidModel_1.Bid.updateOne({ _id: bidId }, {
            $push: { bidHistory: bidHistoryId },
            $set: {
                highestBidderHistoryId: bidHistoryId,
                currentHighestBid: currentHighestBid,
                highestBidderId: highestBidderId,
            },
        }, { new: true });
        return placeBid;
    };
    const updateBidWithClaimedUserId = async (productId, fromUserId) => {
        await bidModel_1.Bid.updateOne({ productId }, { $set: { claimedUserId: fromUserId, isBidAmountPaid: true } });
        return;
    };
    const addBidClaimerAddress = async (bidId, addressEntity) => {
        const newAddress = await bidModel_1.Bid.findByIdAndUpdate(bidId, {
            $set: {
                claimerAddress: {
                    country: addressEntity.getCountry(),
                    state: addressEntity.getState(),
                    district: addressEntity.getDistrict(),
                    city: addressEntity.getCity(),
                    postalCode: addressEntity.getPostalCode(),
                    phone: addressEntity.getPhone(),
                },
                isClaimerAddressAdded: true,
            },
        }, { new: true });
        return newAddress?.claimerAddress;
    };
    const bidResultsForOwner = async (productId, userId) => {
        const result = await bidModel_1.Bid.aggregate([
            { $match: { productId: productId, userId: userId } },
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
                    from: "users",
                    let: { highestBidderId: "$highestBidderId" },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$_id", "$$highestBidderId"] } } },
                    ],
                    as: "winnerData",
                },
            },
            { $unwind: { path: "$winnerData", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "transactions",
                    localField: "transactionId",
                    foreignField: "_id",
                    as: "transactionData",
                },
            },
            {
                $unwind: { path: "$transactionData", preserveNullAndEmptyArrays: true },
            },
            {
                $project: {
                    _id: 1,
                    productId: 1,
                    userId: 1,
                    baseBidPrice: 1,
                    currentHighestBid: 1,
                    bidEndTime: 1,
                    bidHistory: 1,
                    isAdminVerified: 1,
                    biddingStatus: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    highestBidderHistoryId: 1,
                    highestBidderId: 1,
                    claimerAddress: 1,
                    isClaimerAddressAdded: 1,
                    claimedUserId: 1,
                    isBidAmountPaid: 1,
                    "productData._id": 1,
                    "productData.productName": 1,
                    "productData.basePrice": 1,
                    "productData.userId": 1,
                    "productData.productImageUrls": 1,
                    "productData.category": 1,
                    "productData.subCategory": 1,
                    "productData.phone": 1,
                    "productData.description": 1,
                    "productData.createdAt": 1,
                    "productData.productCondition": 1,
                    "productData.productAge": 1,
                    "productData.address": 1,
                    "productData.bookmarkedUsers": 1,
                    "productData.bookmarkedCount": 1,
                    "productData.isBlocked": 1,
                    "productData.isSold": 1,
                    "productData.isOtpVerified": 1,
                    "productData.postStatus": 1,
                    "productData.isBidding": 1,
                    "productData.isAdminAccepted": 1,
                    "productData.bidAcceptedTime": 1,
                    "productData.bidDuration": 1,
                    "productData.bidEndTime": 1,
                    "productData.bidData": 1,
                    "winnerData.imageUrl": 1,
                    "winnerData.userName": 1,
                    "winnerData._id": 1,
                    "winnerData.firstName": 1,
                    "winnerData.lastName": 1,
                    "transactionData._id": 1,
                    "transactionData.fromUserId": 1,
                    "transactionData.toUserId": 1,
                    "transactionData.amount": 1,
                    "transactionData.status": 1,
                    "transactionData.transactionType": 1,
                    "transactionData.createdAt": 1,
                    "transactionData.updatedAt": 1,
                    "transactionData.productId": 1,
                    "transactionData.bidId": 1,
                    "transactionData.shipmentStatus": 1,
                    "transactionData.trackingNumbers": 1,
                },
            },
        ]);
        return result ? result[0] : null;
    };
    const addTransactionIdToBid = async (productId, transactionId) => {
        const bidData = await bidModel_1.Bid.findOne({ productId });
        if (bidData) {
            bidData.transactionId = transactionId;
            await bidData.save();
            return;
        }
        throw new appError_1.default("No BidData Found", httpStatusCodes_1.HttpStatusCodes.BAD_GATEWAY);
    };
    const markBidAsEnded = async (bidId) => {
        const bidData = await bidModel_1.Bid.findOne({ _id: bidId });
        if (bidData) {
            bidData.isBiddingEnded = true;
            await bidData.save();
            return;
        }
        throw new appError_1.default("No BidData Found", httpStatusCodes_1.HttpStatusCodes.BAD_GATEWAY);
    };
    const getTransactionDetailsOfBidEndedProductsAdmin = async (page = 1, limit = 5, searchQuery = "", sort = "createdAt_desc", shipmentStatus = "", paymentStatus = "", fromDate = "", toDate = "") => {
        const skip = (page - 1) * limit;
        const filters = {};
        if (shipmentStatus) {
            filters["transactionData.shipmentStatus"] = shipmentStatus;
        }
        if (paymentStatus) {
            filters["transactionData.status"] = paymentStatus;
        }
        const sortCriteria = {};
        const dateRangeFilter = {};
        if (fromDate && toDate) {
            dateRangeFilter["transactionData.createdAt"] = {
                $gte: new Date(fromDate),
                $lte: new Date(toDate),
            };
        }
        else if (fromDate) {
            dateRangeFilter["transactionData.createdAt"] = {
                $gte: new Date(fromDate),
            };
        }
        else if (toDate) {
            dateRangeFilter["transactionData.createdAt"] = { $lte: new Date(toDate) };
        }
        switch (sort) {
            case "createdAt_asc":
                sortCriteria.createdAt = 1;
                break;
            case "createdAt_desc":
                sortCriteria.createdAt = -1;
                break;
            case "price_asc":
                sortCriteria.baseBidPrice = 1;
                break;
            case "price_desc":
                sortCriteria.baseBidPrice = -1;
                break;
            default:
                sortCriteria.createdAt = -1;
        }
        const searchCriteria = {};
        if (searchQuery) {
            searchCriteria.$or = [
                { "productData.productName": { $regex: searchQuery, $options: "i" } }, // Case-insensitive search by product name
                { "productData._id": { $regex: searchQuery, $options: "i" } }, // Case-insensitive search by product name
                { "transactionData.status": { $regex: searchQuery, $options: "i" } }, // Case-insensitive search by transaction status
                {
                    "transactionData.paymentStatus": {
                        $regex: searchQuery,
                        $options: "i",
                    },
                },
                {
                    "transactionData.shipmentStatus": {
                        $regex: searchQuery,
                        $options: "i",
                    },
                },
                { highestWinnerId: { $regex: searchQuery, $options: "i" } }, // Case-insensitive search by highest winner ID
            ];
        }
        const transactions = await bidModel_1.Bid.aggregate([
            {
                $match: {
                    isBiddingEnded: true,
                },
            },
            {
                $lookup: {
                    from: "transactions",
                    localField: "transactionId",
                    foreignField: "_id",
                    as: "transactionData",
                },
            },
            {
                $unwind: "$transactionData",
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
                $match: {
                    ...searchCriteria,
                    ...filters,
                    ...(Object.keys(dateRangeFilter).length ? dateRangeFilter : {}),
                },
            },
            {
                $project: {
                    _id: 0,
                    bidId: "$_id",
                    productId: "$productId",
                    transactionId: "$transactionData._id",
                    ownerId: "$productData.userId",
                    highestWinnerId: "$highestWinnerId",
                    claimerAddress: "$claimerAddress",
                    paymentStatus: "$transactionData.paymentStatus",
                    transactionStatus: "$transactionData.status",
                    shipmentStatus: "$transactionData.shipmentStatus",
                    price: "$transactionData.price",
                    trackingNumbers: "$transactionData.trackingNumbers",
                    wonPrice: "$currentHighestBid",
                    baseBidPrice: "$baseBidPrice",
                    bidWinnerId: "$highestBidderId",
                    productData: "$productData",
                    createdAt: 1,
                },
            },
            {
                $sort: sortCriteria,
            },
            {
                $skip: skip,
            },
            {
                $limit: limit,
            },
        ]);
        const totalDocuments = await bidModel_1.Bid.aggregate([
            {
                $match: {
                    isBiddingEnded: true,
                    ...searchCriteria,
                    ...filters,
                    ...(Object.keys(dateRangeFilter).length ? dateRangeFilter : {}),
                },
            },
            {
                $count: "totalCount",
            },
        ]);
        const totalDocumentsCount = totalDocuments.length > 0 ? totalDocuments[0].totalCount : 0;
        return {
            transactions,
            totalDocuments: totalDocumentsCount,
            currentPage: page,
        };
    };
    return {
        addBidAfterAdminAccept,
        getBidDetails,
        getHighestBidderDetails,
        getBidById,
        updateBid,
        placeBid,
        updateBidWithClaimedUserId,
        addBidClaimerAddress,
        bidResultsForOwner,
        addTransactionIdToBid,
        markBidAsEnded,
        getTransactionDetailsOfBidEndedProductsAdmin,
    };
};
exports.bidRepositoryMongoDb = bidRepositoryMongoDb;
