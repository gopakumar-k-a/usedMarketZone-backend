"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleGetProductPostAdmin = exports.handleGetPostReports = exports.handleGetCommentReplies = exports.handleGetAllPostComments = exports.handleGetPostDetails = exports.handleGetOwnerPostsImageList = exports.handleGetAllPosts = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const httpStatusCodes_1 = require("../../../types/httpStatusCodes");
const appError_1 = __importDefault(require("../../../utils/appError"));
const handleGetAllPosts = async (userId, productRepository) => {
    const products = await productRepository.getAllProductPost(userId);
    return products;
};
exports.handleGetAllPosts = handleGetAllPosts;
const handleGetOwnerPostsImageList = async (ownerId, productRepository) => {
    const ownerPostsImageList = await productRepository.getOwnerPostsImageList(ownerId);
    return ownerPostsImageList;
};
exports.handleGetOwnerPostsImageList = handleGetOwnerPostsImageList;
const handleGetPostDetails = async (userId, postId, productRepository, bidHistoryRepository, bidRepository) => {
    let postDetails = await productRepository.getUserPostDetails(userId, postId);
    if (!postDetails) {
        throw new appError_1.default("Invalid Post Id", httpStatusCodes_1.HttpStatusCodes.BAD_GATEWAY);
    }
    if (postDetails[0].isBidding) {
        const [previousBidSumOfUser, bidData] = await Promise.all([
            bidHistoryRepository.getUserPreviousBidsSumOnProduct(new mongoose_1.default.Types.ObjectId(userId), postDetails[0]._id),
            bidRepository.getBidDetails(String(postDetails[0]._id)),
        ]);
        postDetails = postDetails.map((post) => ({
            ...post,
            ...(previousBidSumOfUser.length > 0 && {
                previousBidSumOfUser: previousBidSumOfUser[0].previousBidSumOfBidder,
            }),
            ...(bidData && { currentHighestBid: bidData.currentHighestBid }),
        }));
    }
    return postDetails;
};
exports.handleGetPostDetails = handleGetPostDetails;
const handleGetAllPostComments = async (postId, commentRepository) => {
    const commentData = await commentRepository.getAllComments(postId);
    return commentData;
};
exports.handleGetAllPostComments = handleGetAllPostComments;
const handleGetCommentReplies = async (parentCommentId, commentRepository) => {
    const replyData = await commentRepository.getReplyData(parentCommentId);
    return replyData;
};
exports.handleGetCommentReplies = handleGetCommentReplies;
const handleGetPostReports = async (reportRepository) => {
    const postReportData = await reportRepository.getReports();
    return postReportData;
};
exports.handleGetPostReports = handleGetPostReports;
const handleGetProductPostAdmin = async (page = 1, limit = 5, searchQuery = "", sort = "", productRepository) => {
    const { products, totalDocuments, currentPage } = await productRepository.getAllProductPostAdmin(page, limit, searchQuery, sort);
    return { products, totalDocuments, currentPage };
};
exports.handleGetProductPostAdmin = handleGetProductPostAdmin;
