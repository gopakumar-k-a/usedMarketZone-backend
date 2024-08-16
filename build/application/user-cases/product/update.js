"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleDeactivateSellProductPost = exports.handleBlockProductByAdmin = exports.handleReplyComment = exports.handleAdminAcceptedBid = exports.handleAddOrRemoveBookmark = exports.handleProductBidPost = exports.handlePostProduct = void 0;
const createProductPostEntity_1 = __importDefault(require("../../../entities/createProductPostEntity"));
const createBidPostEntity_1 = __importDefault(require("../../../entities/createBidPostEntity"));
const appError_1 = __importDefault(require("../../../utils/appError"));
const httpStatusCodes_1 = require("../../../types/httpStatusCodes");
const createCommentEntity_1 = require("../../../entities/createCommentEntity");
const createBidEntity_1 = require("../../../entities/bidding/createBidEntity");
const bidQueue_1 = require("../../../frameworks/scheduler/bidQueue");
const handlePostProduct = async (postData, userId, productRepository) => {
    const { productName, basePrice, productImageUrls, category, subCategory, phone, description, productCondition, address, productAge, } = postData;
    const createPostEntity = (0, createProductPostEntity_1.default)(productName, basePrice, userId, productImageUrls, category, subCategory, phone, description, productCondition, address, productAge);
    await productRepository.postProduct(createPostEntity);
    return;
};
exports.handlePostProduct = handlePostProduct;
const handleProductBidPost = async (bidData, userId, productRepository, adminBidRequestRepository) => {
    const { productName, basePrice, productImageUrls, category, subCategory, phone, description, productCondition, address, productAge, bidDuration, } = bidData;
    const createBidPostEntity = (0, createBidPostEntity_1.default)(productName, basePrice, userId, productImageUrls, category, subCategory, phone, description, productCondition, address, productAge, bidDuration);
    const newBidPost = await productRepository.postBid(createBidPostEntity);
    if (!newBidPost) {
        throw new appError_1.default("failed to post ", httpStatusCodes_1.HttpStatusCodes.BAD_GATEWAY);
    }
    const newBidRequest = await adminBidRequestRepository.createBidRequestAdmin(String(newBidPost._id), String(newBidPost.userId));
    return;
};
exports.handleProductBidPost = handleProductBidPost;
const handleAddOrRemoveBookmark = async (userId, postId, bookmarkRepository, productRepository) => {
    const bookmark = await bookmarkRepository.findUserBookmarks(userId);
    if (!bookmark) {
        await Promise.all([
            bookmarkRepository.addPostToUserBookmarks(userId, postId),
            productRepository.addUserToProductBookmark(userId, postId),
            productRepository.updateProductBookmarkCount(postId, "inc"),
        ]);
        return { action: "added" };
    }
    if (Array.isArray(bookmark.postIds)) {
        const isBookmarked = bookmark.postIds.includes(postId);
        if (isBookmarked) {
            await Promise.all([
                bookmarkRepository.removePostFromUserBookmarks(userId, postId),
                productRepository.removeUserFromProductBookmark(userId, postId),
                productRepository.updateProductBookmarkCount(postId, "dec"),
            ]);
            return { action: "removed" };
        }
        else {
            await Promise.all([
                bookmarkRepository.addPostToUserBookmarks(userId, postId),
                productRepository.addUserToProductBookmark(userId, postId),
                productRepository.updateProductBookmarkCount(postId, "inc"),
            ]);
            return { action: "added" };
        }
    }
    else {
        return { action: "error" };
    }
};
exports.handleAddOrRemoveBookmark = handleAddOrRemoveBookmark;
const handleAdminAcceptedBid = async (bidProductId, bidDuration, productRepository, bidRepository) => {
    const updatedBidProduct = await productRepository.updateAdminAcceptBidStatus(bidProductId, bidDuration);
    if (!updatedBidProduct) {
        throw new appError_1.default("check bid product Id , no Product Found ", httpStatusCodes_1.HttpStatusCodes.BAD_GATEWAY);
    }
    const newBidEntity = (0, createBidEntity_1.createBidEntity)(updatedBidProduct._id, updatedBidProduct.userId, String(updatedBidProduct.basePrice), String(updatedBidProduct.bidEndTime));
    const newlyAddedBid = await bidRepository.addBidAfterAdminAccept(newBidEntity);
    updatedBidProduct.bidData = newlyAddedBid._id;
    await productRepository.updateProduct(bidProductId, updatedBidProduct);
    const delay = new Date(updatedBidProduct.bidEndTime).getTime() - Date.now();
    bidQueue_1.bidQueue.add("closebid", { bidId: newlyAddedBid._id, productId: newlyAddedBid.productId }, { delay: delay });
    return true;
};
exports.handleAdminAcceptedBid = handleAdminAcceptedBid;
const handleReplyComment = async (commentData, authorId, commentRepository) => {
    const createCommentEntity = (0, createCommentEntity_1.commentEntity)(commentData.content, authorId, commentData.postId, commentData.parentCommentId);
    const newComment = await commentRepository.submitReplyComment(createCommentEntity);
    return newComment;
};
exports.handleReplyComment = handleReplyComment;
const handleBlockProductByAdmin = async (productId, productRepository) => {
    const currentProductStatus = await productRepository.blockProductByAdmin(productId);
    return currentProductStatus;
};
exports.handleBlockProductByAdmin = handleBlockProductByAdmin;
const handleDeactivateSellProductPost = async (userId, productId, productRepository) => {
    const productActiveStatus = await productRepository.deactivateProductSellPost(userId, productId);
    return productActiveStatus;
};
exports.handleDeactivateSellProductPost = handleDeactivateSellProductPost;
