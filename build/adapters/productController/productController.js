"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productController = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const httpStatusCodes_1 = require("../../types/httpStatusCodes");
const update_1 = require("../../application/user-cases/product/update");
const get_1 = require("../../application/user-cases/product/get");
const create_1 = require("../../application/user-cases/product/create");
const delete_1 = require("../../application/user-cases/product/delete");
const get_2 = require("../../application/user-cases/bookmarks/get");
const productController = (productDbRepository, productDbImpl, bookmarkRepository, bookmarkDbImpl, productReportRepository, productReportDbImpl, commentRepository, commentDbImpl, bidHistoryRepository, bidHistoryImpl, bidRepository, bidImpl) => {
    const dbRepositoryProduct = productDbRepository(productDbImpl());
    const dbRepositoryBookmark = bookmarkRepository(bookmarkDbImpl());
    const dbProductReport = productReportRepository(productReportDbImpl());
    const dbRepositoryComment = commentRepository(commentDbImpl());
    const dbBidHistory = bidHistoryRepository(bidHistoryImpl());
    const dbBid = bidRepository(bidImpl());
    const productPost = (0, express_async_handler_1.default)(async (req, res) => {
        const { _id } = req.user;
        await (0, update_1.handlePostProduct)(req.body, _id, dbRepositoryProduct);
        res.status(httpStatusCodes_1.HttpStatusCodes.OK).json({
            success: true,
            message: "product posted success",
        });
    });
    const getAllPosts = (0, express_async_handler_1.default)(async (req, res) => {
        const { _id } = req.user;
        const allPosts = await (0, get_1.handleGetAllPosts)(_id, dbRepositoryProduct);
        res.status(httpStatusCodes_1.HttpStatusCodes.OK).json({
            success: true,
            message: "user posts retrived success",
            allPosts,
        });
    });
    const addOrRemoveBookmark = (0, express_async_handler_1.default)(async (req, res) => {
        const { postId } = req.params;
        const { _id } = req.user;
        const result = await (0, update_1.handleAddOrRemoveBookmark)(_id, postId, dbRepositoryBookmark, dbRepositoryProduct);
        res.status(httpStatusCodes_1.HttpStatusCodes.OK).json({
            success: true,
            message: `bookmark ${result?.action} successfully`,
            action: result?.action,
        });
    });
    const reportPost = (0, express_async_handler_1.default)(async (req, res) => {
        const { _id } = req.user;
        console.log("report post body ", req.body);
        await (0, create_1.handlePostReportSubmit)(_id, req.body, dbProductReport);
        res.status(httpStatusCodes_1.HttpStatusCodes.OK).json({
            success: true,
            message: "report submitted successfully",
        });
    });
    const getOwnerPostsImageList = (0, express_async_handler_1.default)(async (req, res) => {
        const { _id } = req.user;
        const ownerPostsImageList = await (0, get_1.handleGetOwnerPostsImageList)(_id, dbRepositoryProduct);
        res.status(httpStatusCodes_1.HttpStatusCodes.OK).json({
            success: true,
            message: "owner post image list retrived successfully",
            ownerPostsImageList,
        });
    });
    const getPostDetails = (0, express_async_handler_1.default)(async (req, res) => {
        const { postId } = req.params;
        const { _id } = req.user;
        const postDetails = await (0, get_1.handleGetPostDetails)(_id, postId, dbRepositoryProduct, dbBidHistory, dbBid);
        res.status(httpStatusCodes_1.HttpStatusCodes.OK).json({
            success: true,
            message: "owner post image list retrived successfully",
            postDetails,
        });
    });
    const addComment = (0, express_async_handler_1.default)(async (req, res) => {
        const { _id } = req.user;
        const newCommentData = await (0, create_1.handleAddComment)(req.body, _id, dbRepositoryComment);
        res.status(httpStatusCodes_1.HttpStatusCodes.OK).json({
            success: true,
            message: "comment added successfully",
            newCommentData,
        });
    });
    const replyComment = (0, express_async_handler_1.default)(async (req, res) => {
        const { _id } = req.user;
        const newCommentData = await (0, update_1.handleReplyComment)(req.body, _id, dbRepositoryComment);
        res.status(httpStatusCodes_1.HttpStatusCodes.OK).json({
            success: true,
            message: "comment replied successfully",
            newCommentData,
        });
    });
    const getAllPostComments = (0, express_async_handler_1.default)(async (req, res) => {
        const { postId } = req.params;
        const commentData = await (0, get_1.handleGetAllPostComments)(postId, dbRepositoryComment);
        res.status(httpStatusCodes_1.HttpStatusCodes.OK).json({
            success: true,
            message: "comment data retrived successfully",
            commentData,
        });
    });
    const getCommentReply = (0, express_async_handler_1.default)(async (req, res) => {
        const { commentId } = req.params;
        const replyData = await (0, get_1.handleGetCommentReplies)(commentId, dbRepositoryComment);
        res.status(httpStatusCodes_1.HttpStatusCodes.OK).json({
            success: true,
            message: "comment reply data retrived successfully",
            replyData,
        });
    });
    const deleteComment = (0, express_async_handler_1.default)(async (req, res) => {
        await (0, delete_1.handleDeleteComment)(req.body, dbRepositoryComment);
        res.status(httpStatusCodes_1.HttpStatusCodes.OK).json({
            success: true,
            message: "comment deleted successfully",
        });
    });
    const getBookmarkImageList = (0, express_async_handler_1.default)(async (req, res) => {
        const { _id } = req.user;
        const bookmarkImageList = await (0, get_2.handleGetBookmarkImageList)(_id, dbRepositoryBookmark);
        res.status(httpStatusCodes_1.HttpStatusCodes.OK).json({
            success: true,
            message: "bookmark image List Retrived successfully",
            bookmarkImageList,
        });
    });
    const deActivatePost = (0, express_async_handler_1.default)(async (req, res) => {
        const { _id: userId } = req.user;
        const { postId } = req.params;
        const isDeactivatedPost = await (0, update_1.handleDeactivateSellProductPost)(userId, postId, dbRepositoryProduct);
        res.status(httpStatusCodes_1.HttpStatusCodes.OK).json({
            success: true,
            message: `product ${isDeactivatedPost ? "de-activated" : "activated"} successfully`,
            isDeactivatedPost,
        });
    });
    return {
        productPost,
        getAllPosts,
        addOrRemoveBookmark,
        reportPost,
        getOwnerPostsImageList,
        getPostDetails,
        addComment,
        getAllPostComments,
        replyComment,
        getCommentReply,
        deleteComment,
        getBookmarkImageList,
        deActivatePost,
    };
};
exports.productController = productController;
