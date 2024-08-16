"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentRepositoryMongoDb = void 0;
const commentModel_1 = __importDefault(require("../models/commentModel"));
const mongoose_1 = __importDefault(require("mongoose"));
const { ObjectId } = mongoose_1.default.Types;
const commentRepositoryMongoDb = () => {
    const addNewComment = async (commentEntity) => {
        const newComment = new commentModel_1.default({
            content: commentEntity.getContent(),
            authorId: commentEntity.getAuthorId(),
            postId: commentEntity.getPostId(),
        });
        await newComment.save();
        const newCommentData = await commentModel_1.default.aggregate([
            {
                $match: {
                    _id: newComment._id,
                },
            },
            {
                $lookup: {
                    from: "users",
                    foreignField: "_id",
                    localField: "authorId",
                    as: "userData",
                },
            },
            {
                $unwind: "$userData",
            },
            {
                $lookup: {
                    from: "products",
                    foreignField: "_id",
                    localField: "postId",
                    as: "productData",
                },
            },
            {
                $unwind: "$productData",
            },
            {
                $project: {
                    imageUrl: "$userData.imageUrl",
                    userName: "$userData.userName",
                    content: 1,
                    authorId: 1,
                    productOwnerId: "$productData.userId",
                    replies: 1,
                    createdAt: 1,
                },
            },
        ]);
        return newCommentData;
    };
    const getAllComments = async (postId) => {
        const commentData = await commentModel_1.default.aggregate([
            {
                $match: {
                    postId: new ObjectId(postId),
                    parentCommentId: null,
                },
            },
            {
                $lookup: {
                    from: "users",
                    foreignField: "_id",
                    localField: "authorId",
                    as: "userData",
                },
            },
            {
                $unwind: "$userData",
            },
            {
                $project: {
                    imageUrl: "$userData.imageUrl",
                    userName: "$userData.userName",
                    content: 1,
                    authorId: 1,
                    createdAt: 1,
                    replies: 1,
                },
            },
            {
                $sort: {
                    createdAt: -1,
                },
            },
        ]);
        return commentData;
    };
    const getReplyData = async (parentCommentId) => {
        const replyData = await commentModel_1.default.aggregate([
            {
                $match: {
                    parentCommentId: new ObjectId(parentCommentId),
                },
            },
            {
                $lookup: {
                    from: "users",
                    foreignField: "_id",
                    localField: "authorId",
                    as: "userData",
                },
            },
            {
                $unwind: "$userData",
            },
            {
                $project: {
                    imageUrl: "$userData.imageUrl",
                    userName: "$userData.userName",
                    content: 1,
                    authorId: 1,
                    createdAt: 1,
                    // replies: 1,
                },
            },
            {
                $sort: {
                    createdAt: -1,
                },
            },
        ]);
        return replyData;
    };
    const submitReplyComment = async (commentEntity) => {
        const parentCommentId = commentEntity.getParentCommentId();
        const newComment = new commentModel_1.default({
            content: commentEntity.getContent(),
            authorId: commentEntity.getAuthorId(),
            postId: commentEntity.getPostId(),
            parentCommentId: commentEntity.getParentCommentId(),
        });
        await newComment.save();
        await commentModel_1.default.findByIdAndUpdate(parentCommentId, { $push: { replies: newComment._id } }, { new: true });
        const newReply = await commentModel_1.default.aggregate([
            {
                $match: {
                    _id: newComment._id,
                },
            },
            {
                $lookup: {
                    from: "users",
                    foreignField: "_id",
                    localField: "authorId",
                    as: "userData",
                },
            },
            {
                $unwind: "$userData",
            },
            {
                $project: {
                    imageUrl: "$userData.imageUrl",
                    userName: "$userData.userName",
                    content: 1,
                    authorId: 1,
                    createdAt: 1,
                    parentCommentId: 1,
                },
            },
        ]);
        return newReply;
    };
    const deleteComment = async (commentId, parentCommentId = null) => {
        if (parentCommentId) {
            await commentModel_1.default.findByIdAndUpdate(parentCommentId, {
                $pull: { replies: commentId },
            });
        }
        else {
            const parentDocument = await commentModel_1.default.findOne({ _id: commentId });
            if (parentDocument && parentDocument.replies.length > 0) {
                await commentModel_1.default.deleteMany({ _id: { $in: parentDocument.replies } });
            }
        }
        await commentModel_1.default.deleteOne({ _id: commentId });
        return;
    };
    return {
        addNewComment,
        getAllComments,
        submitReplyComment,
        getReplyData,
        deleteComment,
    };
};
exports.commentRepositoryMongoDb = commentRepositoryMongoDb;
