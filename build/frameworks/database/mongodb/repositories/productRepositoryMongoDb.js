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
exports.productRepositoryMongoDb = void 0;
const productModel_1 = __importDefault(require("../models/productModel"));
const mongoose_1 = __importStar(require("mongoose"));
const httpStatusCodes_1 = require("../../../../types/httpStatusCodes");
const appError_1 = __importDefault(require("../../../../utils/appError"));
const { ObjectId } = mongoose_1.default.Types;
const productRepositoryMongoDb = () => {
    const postProduct = async (product) => {
        const productData = {
            productName: product.getProductName(),
            basePrice: product.getBasePrice(),
            userId: product.getUserId(),
            productImageUrls: product.getProductImageUrls(),
            category: product.getCategory(),
            subCategory: product.getSubCategory(),
            phone: product.getPhone(),
            description: product.getDescription(),
            productCondition: product.getProductCondition(),
            address: product.getAddress(),
            productAge: product.getProductAge(),
            isAdminAccepted: true,
        };
        const newProduct = new productModel_1.default(productData);
        await newProduct.save();
        return newProduct;
    };
    const postBid = async (bid) => {
        const bidData = {
            productName: bid.getProductName(),
            basePrice: bid.getBasePrice(),
            userId: bid.getUserId(),
            productImageUrls: bid.getProductImageUrls(),
            category: bid.getCategory(),
            subCategory: bid.getSubCategory(),
            phone: bid.getPhone(),
            description: bid.getDescription(),
            productCondition: bid.getProductCondition(),
            address: bid.getAddress(),
            productAge: bid.getProductAge(),
            isBidding: true,
            bidDuration: bid.getBidDuration(),
        };
        const newProduct = new productModel_1.default(bidData);
        await newProduct.save();
        return newProduct;
    };
    const getAllProductPost = async (userId) => {
        const products = await productModel_1.default.aggregate([
            {
                $match: {
                    isAdminAccepted: true,
                    isDeactivatedPost: false,
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userDetails",
                },
            },
            {
                $unwind: "$userDetails",
            },
            {
                $addFields: {
                    isBookmarked: { $in: [userId, "$bookmarkedUsers"] },
                },
            },
            {
                $lookup: {
                    from: "bids",
                    localField: "bidData",
                    foreignField: "_id",
                    as: "bidDetails",
                },
            },
            {
                $unwind: {
                    path: "$bidDetails",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $addFields: {
                    currentHighestBid: "$bidDetails.currentHighestBid",
                },
            },
            {
                $project: {
                    _id: 1,
                    productName: 1,
                    basePrice: 1,
                    userId: 1,
                    productImageUrls: 1,
                    category: 1,
                    subCategory: 1,
                    phone: 1,
                    description: 1,
                    productCondition: 1,
                    productAge: 1,
                    bookmarkedCount: 1,
                    address: 1,
                    "userDetails.userName": 1,
                    "userDetails.imageUrl": 1,
                    isBookmarked: 1,
                    createdAt: 1,
                    isBidding: 1,
                    bidEndTime: 1,
                    bidAcceptedTime: 1,
                    currentHighestBid: 1,
                },
            },
            {
                $sort: {
                    createdAt: -1,
                },
            },
        ]);
        return products;
    };
    const addUserToProductBookmark = async (userId, productId) => {
        const productData = productModel_1.default.findById(productId);
        if (productData) {
            await productData.updateOne({ productId }, { $push: { bookmarkedUsers: userId } });
            return true;
        }
        return false;
    };
    const removeUserFromProductBookmark = async (userId, productId) => {
        const productData = productModel_1.default.findById(productId);
        if (productData) {
            await productData.updateOne({ productId }, { $pull: { bookmarkedUsers: userId } });
            return true;
        }
        return false;
    };
    const updateProductBookmarkCount = async (productId, action) => {
        let updatedProduct;
        if (action == "inc") {
            updatedProduct = await productModel_1.default.findOneAndUpdate({ _id: productId }, { $inc: { bookmarkedCount: 1 } }, { new: true });
        }
        else if (action == "dec") {
            updatedProduct = await productModel_1.default.findOneAndUpdate({ _id: productId }, { $inc: { bookmarkedCount: -1 } }, { new: true });
        }
        else {
            return false;
        }
        if (!updatedProduct) {
            return false;
        }
        return updatedProduct;
    };
    const getUserPosts = async (userId) => {
        const userPosts = await productModel_1.default.aggregate([
            { $match: { userId: new ObjectId(userId) } },
            {
                $project: {
                    productName: 1,
                    basePrice: 1,
                    userId: 1,
                    isSold: 1,
                    isBlocked: 1,
                    category: 1,
                    subCategory: 1,
                    productImageUrls: 1,
                    address: 1,
                    createdAt: 1,
                    bidEndTime: 1,
                    isBidding: 1,
                },
            },
            {
                $sort: {
                    createdAt: -1,
                },
            },
        ]);
        if (!userPosts) {
            return false;
        }
        return userPosts;
    };
    const getUserPostDetailsAdmin = async (postId) => {
        const products = await productModel_1.default.aggregate([
            {
                $match: {
                    _id: new mongoose_1.Types.ObjectId(postId),
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userDetails",
                },
            },
            {
                $unwind: "$userDetails",
            },
            {
                $lookup: {
                    from: "bids",
                    localField: "bidData",
                    foreignField: "_id",
                    as: "bidDetails",
                },
            },
            {
                $unwind: {
                    path: "$bidDetails",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $addFields: {
                    currentHighestBid: "$bidDetails.currentHighestBid",
                },
            },
            {
                $project: {
                    _id: 1,
                    productName: 1,
                    basePrice: 1,
                    userId: 1,
                    productImageUrls: 1,
                    category: 1,
                    subCategory: 1,
                    phone: 1,
                    description: 1,
                    productCondition: 1,
                    productAge: 1,
                    bookmarkedCount: 1,
                    address: 1,
                    "userDetails.userName": 1,
                    "userDetails.imageUrl": 1,
                    isBookmarked: 1,
                    createdAt: 1,
                    isBidding: 1,
                    bidEndTime: 1,
                    bidAcceptedTime: 1,
                    currentHighestBid: 1,
                },
            },
            {
                $sort: {
                    createdAt: -1,
                },
            },
        ]);
        return products;
    };
    const updateAdminAcceptBidStatus = async (bidProductId, bidDuration) => {
        const bidAcceptedTime = new Date();
        const bidEndTime = new Date(bidAcceptedTime.getTime() +
            bidDuration.day * 24 * 60 * 60 * 1000 +
            bidDuration.hour * 60 * 60 * 1000 +
            bidDuration.minute * 60 * 1000);
        const updatedBid = await productModel_1.default.findByIdAndUpdate(bidProductId, {
            $set: { isAdminAccepted: true, bidEndTime, bidAcceptedTime },
        }, { new: true });
        return updatedBid;
    };
    const getAllUserPosts = async () => {
        const userPosts = await productModel_1.default.aggregate([
            {
                $project: {
                    productName: 1,
                    basePrice: 1,
                    userId: 1,
                    isSold: 1,
                    isBlocked: 1,
                    category: 1,
                    subCategory: 1,
                    productImageUrls: 1,
                    address: 1,
                    createdAt: 1,
                    bidEndTime: 1,
                    isBidding: 1,
                    isDeactivatedPost: 1,
                },
            },
            {
                $sort: {
                    createdAt: -1,
                },
            },
        ]);
        return userPosts;
    };
    const getOwnerPostsImageList = async (ownerId) => {
        const postsListImages = await productModel_1.default.aggregate([
            {
                $match: {
                    userId: ownerId,
                    isAdminAccepted: true,
                },
            },
            {
                $project: {
                    productImageUrls: 1,
                    createdAt: 1,
                    isBidding: 1,
                },
            },
            {
                $sort: {
                    createdAt: -1,
                },
            },
        ]);
        if (!postsListImages) {
            throw new appError_1.default("Invalid Post Id", httpStatusCodes_1.HttpStatusCodes.BAD_GATEWAY);
        }
        return postsListImages;
    };
    const getUserPostDetails = async (userId, postId) => {
        const products = await productModel_1.default.aggregate([
            {
                $match: {
                    _id: new ObjectId(postId),
                    isAdminAccepted: true,
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userDetails",
                },
            },
            {
                $unwind: "$userDetails",
            },
            {
                $addFields: {
                    isBookmarked: { $in: [userId, "$bookmarkedUsers"] },
                },
            },
            {
                $project: {
                    _id: 1,
                    productName: 1,
                    basePrice: 1,
                    userId: 1,
                    productImageUrls: 1,
                    category: 1,
                    subCategory: 1,
                    phone: 1,
                    description: 1,
                    productCondition: 1,
                    productAge: 1,
                    bookmarkedCount: 1,
                    address: 1,
                    "userDetails.userName": 1,
                    "userDetails.imageUrl": 1,
                    isBookmarked: 1,
                    createdAt: 1,
                    isBidding: 1,
                    bidEndTime: 1,
                    bidAcceptedTime: 1,
                    isDeactivatedPost: 1,
                },
            },
            {
                $sort: {
                    createdAt: -1,
                },
            },
        ]);
        if (!products) {
            throw new appError_1.default("invalid product id ", httpStatusCodes_1.HttpStatusCodes.BAD_REQUEST);
        }
        return products;
    };
    const updateProduct = async (productId, update) => {
        const updatedProduct = await productModel_1.default.findByIdAndUpdate(productId, update, {
            new: true,
        });
        return updatedProduct;
    };
    const blockProductByAdmin = async (productId) => {
        const product = await productModel_1.default.findById(productId);
        if (!product) {
            throw new appError_1.default("Invalid Product Id ", httpStatusCodes_1.HttpStatusCodes.BAD_REQUEST);
        }
        const updatedProduct = await productModel_1.default.findByIdAndUpdate(productId, { isBlocked: !product.isBlocked }, { new: true });
        return updatedProduct?.isBlocked;
    };
    const deactivateProductSellPost = async (userId, productId) => {
        const productSellPost = await productModel_1.default.findOne({
            _id: productId,
            userId,
            isBidding: false,
        });
        if (!productSellPost) {
            throw new appError_1.default("no Product Found Check the Product Id", httpStatusCodes_1.HttpStatusCodes.BAD_REQUEST);
        }
        productSellPost.isDeactivatedPost = !productSellPost.isDeactivatedPost;
        await productSellPost.save();
        return productSellPost.isDeactivatedPost;
    };
    const searchProduct = async (query, isBidding, userId) => {
        const regex = new RegExp(query.trim(), "i");
        const results = await productModel_1.default.aggregate([
            {
                $match: {
                    isBidding: isBidding,
                    $or: [
                        { description: regex },
                        { productName: regex },
                        { category: regex },
                        { subCategory: regex },
                    ],
                    isAdminAccepted: true,
                    isDeactivatedPost: false,
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userDetails",
                },
            },
            {
                $unwind: "$userDetails",
            },
            {
                $addFields: {
                    isBookmarked: { $in: [userId, "$bookmarkedUsers"] },
                },
            },
            {
                $lookup: {
                    from: "bids",
                    localField: "bidData",
                    foreignField: "_id",
                    as: "bidDetails",
                },
            },
            {
                $unwind: {
                    path: "$bidDetails",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $addFields: {
                    currentHighestBid: "$bidDetails.currentHighestBid",
                },
            },
            {
                $project: {
                    _id: 1,
                    productName: 1,
                    basePrice: 1,
                    userId: 1,
                    productImageUrls: 1,
                    category: 1,
                    subCategory: 1,
                    phone: 1,
                    description: 1,
                    productCondition: 1,
                    productAge: 1,
                    bookmarkedCount: 1,
                    address: 1,
                    "userDetails.userName": 1,
                    "userDetails.imageUrl": 1,
                    isBookmarked: 1,
                    createdAt: 1,
                    isBidding: 1,
                    bidEndTime: 1,
                    bidAcceptedTime: 1,
                    currentHighestBid: 1,
                    isSold: 1,
                    isBlocked: 1,
                    isDeactivatedPost: 1,
                },
            },
            {
                $sort: {
                    createdAt: -1,
                },
            },
        ]);
        return results;
    };
    const getUserBids = async (userId) => {
        const userBids = await productModel_1.default.aggregate([
            {
                $match: {
                    userId: userId,
                    isBidding: true,
                },
            },
            {
                $lookup: {
                    from: "bids",
                    localField: "bidData",
                    foreignField: "_id",
                    as: "bidData",
                },
            },
            {
                $unwind: {
                    path: "$bidData",
                    preserveNullAndEmptyArrays: true,
                },
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
                $addFields: {
                    productStatus: {
                        $switch: {
                            branches: [
                                {
                                    case: {
                                        $eq: ["$transactionData.shipmentStatus", "not_shipped"],
                                    },
                                    then: "not_shipped",
                                },
                                {
                                    case: {
                                        $eq: [
                                            "$transactionData.shipmentStatus",
                                            "shipped_to_admin",
                                        ],
                                    },
                                    then: "shipped_to_admin",
                                },
                                {
                                    case: {
                                        $eq: [
                                            "$transactionData.shipmentStatus",
                                            "received_by_admin",
                                        ],
                                    },
                                    then: "received_by_admin",
                                },
                                {
                                    case: {
                                        $eq: [
                                            "$transactionData.shipmentStatus",
                                            "shipped_to_buyer",
                                        ],
                                    },
                                    then: "shipped_to_buyer",
                                },
                                {
                                    case: {
                                        $eq: ["$transactionData.shipmentStatus", "delivered"],
                                    },
                                    then: "Delivered",
                                },
                            ],
                            default: "processing",
                        },
                    },
                },
            },
            {
                $project: {
                    productName: 1,
                    basePrice: 1,
                    productImageUrls: 1,
                    category: 1,
                    bidDuration: 1,
                    subCategory: 1,
                    isAdminAccepted: 1,
                    bidEndTime: 1,
                    productStatus: 1,
                    createdAt: 1,
                },
            },
            {
                $sort: {
                    createdAt: -1,
                },
            },
        ]);
        return userBids;
    };
    const getAllProductPostAdmin = async (page = 1, limit = 5, searchQuery = "", sort = "createdAt_desc") => {
        const skip = (page - 1) * limit;
        const searchCriteria = searchQuery
            ? {
                $or: [
                    { productName: { $regex: searchQuery, $options: "i" } },
                    { category: { $regex: searchQuery, $options: "i" } },
                    { subCategory: { $regex: searchQuery, $options: "i" } },
                    { description: { $regex: searchQuery, $options: "i" } },
                ],
            }
            : {};
        const sortCriteria = {};
        switch (sort) {
            case "createdAt_asc":
                sortCriteria.createdAt = 1;
                break;
            case "createdAt_desc":
                sortCriteria.createdAt = -1;
                break;
            case "price_asc":
                sortCriteria.basePrice = 1;
                break;
            case "price_desc":
                sortCriteria.basePrice = -1;
                break;
            default:
                sortCriteria.createdAt = -1;
        }
        const totalDocuments = await productModel_1.default.countDocuments({
            isAdminAccepted: true,
            isDeactivatedPost: false,
            ...searchCriteria,
        });
        const products = await productModel_1.default.aggregate([
            {
                $match: {
                    isAdminAccepted: true,
                    isDeactivatedPost: false,
                    ...searchCriteria,
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userDetails",
                },
            },
            {
                $unwind: "$userDetails",
            },
            {
                $lookup: {
                    from: "bids",
                    localField: "bidData",
                    foreignField: "_id",
                    as: "bidDetails",
                },
            },
            {
                $unwind: {
                    path: "$bidDetails",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $addFields: {
                    currentHighestBid: "$bidDetails.currentHighestBid",
                },
            },
            {
                $project: {
                    _id: 1,
                    productName: 1,
                    basePrice: 1,
                    userId: 1,
                    productImageUrls: 1,
                    category: 1,
                    subCategory: 1,
                    phone: 1,
                    description: 1,
                    productCondition: 1,
                    productAge: 1,
                    bookmarkedCount: 1,
                    address: 1,
                    "userDetails.userName": 1,
                    "userDetails.imageUrl": 1,
                    isBookmarked: 1,
                    createdAt: 1,
                    isBidding: 1,
                    bidEndTime: 1,
                    bidAcceptedTime: 1,
                    currentHighestBid: 1,
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
        return {
            products,
            totalDocuments,
            currentPage: page,
        };
    };
    const getNumberOfProducts = async () => {
        const [result] = await productModel_1.default.aggregate([
            {
                $facet: {
                    numberOfProducts: [{ $count: "totalProducts" }],
                    numberOfBidProducts: [
                        { $match: { isBidding: true } },
                        { $count: "totalBidProducts" },
                    ],
                    numberOfNonBidProducts: [
                        { $match: { isBidding: false } },
                        { $count: "totalNonBidProducts" },
                    ],
                },
            },
            {
                $project: {
                    numberOfProducts: {
                        $arrayElemAt: ["$numberOfProducts.totalProducts", 0],
                    },
                    numberOfBidProducts: {
                        $arrayElemAt: ["$numberOfBidProducts.totalBidProducts", 0],
                    },
                    numberOfNonBidProducts: {
                        $arrayElemAt: ["$numberOfNonBidProducts.totalNonBidProducts", 0],
                    },
                },
            },
        ]);
        return {
            numberOfProducts: result?.numberOfProducts || 0,
            numberOfBidProducts: result?.numberOfBidProducts || 0,
            numberOfNonBidProducts: result?.numberOfNonBidProducts || 0,
        };
    };
    return {
        postProduct,
        getAllProductPost,
        addUserToProductBookmark,
        removeUserFromProductBookmark,
        updateProductBookmarkCount,
        getUserPosts,
        getUserPostDetailsAdmin,
        postBid,
        updateAdminAcceptBidStatus,
        getAllUserPosts,
        getOwnerPostsImageList,
        getUserPostDetails,
        updateProduct,
        blockProductByAdmin,
        deactivateProductSellPost,
        searchProduct,
        getUserBids,
        getAllProductPostAdmin,
        getNumberOfProducts,
    };
};
exports.productRepositoryMongoDb = productRepositoryMongoDb;
