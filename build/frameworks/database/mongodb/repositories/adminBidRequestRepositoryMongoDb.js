"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminBidRequestMongoDb = void 0;
const adminBidRequestModel_1 = __importDefault(require("../models/adminBidRequestModel"));
const adminBidRequestMongoDb = () => {
    const createBidRequestAdmin = async (bidProductId, bidderId) => {
        const newBidRequest = new adminBidRequestModel_1.default({
            bidderId,
            bidProductId,
        });
        await newBidRequest.save();
        return newBidRequest;
    };
    const getBidRequestsFromDb = async (search = "", page = 1, limit = 5, sort = "createdAt_desc") => {
        const skip = (page - 1) * limit;
        let sortCriteria = {};
        switch (sort) {
            case "createdAt_asc":
                sortCriteria.createdAt = 1;
                break;
            case "createdAt_desc":
                sortCriteria.createdAt = -1;
                break;
            case "price_asc":
                sortCriteria["productData.basePrice"] = 1;
                break;
            case "price_desc":
                sortCriteria["productData.basePrice"] = -1;
                break;
            default:
                sortCriteria.createdAt = -1;
        }
        const matchCriteria = search
            ? {
                $or: [
                    { "productData.productName": { $regex: search, $options: "i" } },
                    { "userData.firstName": { $regex: search, $options: "i" } },
                    { "userData.lastName": { $regex: search, $options: "i" } },
                    { "userData.userName": { $regex: search, $options: "i" } },
                ],
            }
            : {};
        const bidRequests = await adminBidRequestModel_1.default.aggregate([
            {
                $lookup: {
                    from: "products",
                    localField: "bidProductId",
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
                    localField: "bidderId",
                    foreignField: "_id",
                    as: "userData",
                },
            },
            {
                $unwind: "$userData",
            },
            {
                $match: matchCriteria,
            },
            {
                $project: {
                    _id: 1,
                    bidderId: 1,
                    bidProductId: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    "productData._id": 1,
                    "productData.productName": 1,
                    "productData.basePrice": 1,
                    "productData.productImageUrls": 1,
                    "productData.category": 1,
                    "productData.bidDuration": 1,
                    "productData.subCategory": 1,
                    "productData.isAdminAccepted": 1,
                    "productData.bidEndTime": 1,
                    "userData.firstName": 1,
                    "userData.lastName": 1,
                    "userData.email": 1,
                    "userData.userName": 1,
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
        const totalBidRequests = await adminBidRequestModel_1.default.aggregate([
            {
                $lookup: {
                    from: "products",
                    localField: "bidProductId",
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
                    localField: "bidderId",
                    foreignField: "_id",
                    as: "userData",
                },
            },
            {
                $unwind: "$userData",
            },
            {
                $match: matchCriteria,
            },
            {
                $count: "total",
            },
        ]);
        const totalDocuments = totalBidRequests[0]?.total || 0;
        return {
            bidRequests,
            totalDocuments,
            currentPage: page,
        };
    };
    const getUserWiseBidRequests = async (userId) => {
        console.log("user id getUserWiseBidRequests", userId);
        const userBidRequests = await adminBidRequestModel_1.default.aggregate([
            {
                $match: {
                    bidderId: userId,
                },
            },
            {
                $lookup: {
                    from: "products",
                    localField: "bidProductId",
                    foreignField: "_id",
                    as: "productData",
                },
            },
            {
                $unwind: "$productData",
            },
            {
                $project: {
                    _id: 1,
                    bidderId: 1,
                    bidProductId: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    "productData._id": 1,
                    "productData.productName": 1,
                    "productData.basePrice": 1,
                    "productData.productImageUrls": 1,
                    "productData.category": 1,
                    "productData.bidDuration": 1,
                    "productData.subCategory": 1,
                    "productData.isAdminAccepted": 1,
                    "productData.bidEndTime": 1,
                    "userData.firstName": 1,
                },
            },
            {
                $sort: {
                    createdAt: -1,
                },
            },
        ]);
        console.log("userBidRequests ", userBidRequests);
        return userBidRequests;
    };
    return {
        createBidRequestAdmin,
        getBidRequestsFromDb,
        getUserWiseBidRequests,
    };
};
exports.adminBidRequestMongoDb = adminBidRequestMongoDb;
