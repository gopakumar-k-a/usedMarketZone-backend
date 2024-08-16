"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.conversationRepositoryMongoDb = void 0;
const conversationModel_1 = require("../models/conversationModel");
const mongoose_1 = __importDefault(require("mongoose"));
const { ObjectId } = mongoose_1.default.Types;
const conversationRepositoryMongoDb = () => {
    const createConversation = async (conversationEntity) => {
        let conversation = await conversationModel_1.Conversation.findOne({
            participants: {
                $all: [
                    conversationEntity.getSenderId(),
                    conversationEntity.getRecieverId(),
                ],
            },
        });
        if (!conversation) {
            conversation = await conversationModel_1.Conversation.create({
                participants: [
                    conversationEntity.getSenderId(),
                    conversationEntity.getRecieverId(),
                ],
                messages: [conversationEntity.getMessageId()],
            });
        }
        else {
            conversation.messages.push(conversationEntity.getMessageId());
            await conversation.save();
        }
        return conversation._id;
    };
    const getMessages = async (recieverId, userToChatId) => {
        const chats = await conversationModel_1.Conversation.aggregate([
            {
                $match: {
                    participants: {
                        $all: [new ObjectId(recieverId), new ObjectId(userToChatId)],
                    },
                },
            },
            {
                $lookup: {
                    from: "messages",
                    localField: "messages",
                    foreignField: "_id",
                    as: "chat",
                },
            },
            { $unwind: "$chat" },
            {
                $lookup: {
                    from: "products",
                    localField: "chat.postId",
                    foreignField: "_id",
                    as: "post",
                },
            },
            {
                $unwind: { path: "$post", preserveNullAndEmptyArrays: true },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "post.userId",
                    foreignField: "_id",
                    as: "user",
                },
            },
            {
                $unwind: { path: "$user", preserveNullAndEmptyArrays: true },
            },
            {
                $project: {
                    _id: 0,
                    message: "$chat.message",
                    senderId: "$chat.senderId",
                    recieverId: "$chat.recieverId",
                    createdAt: "$chat.createdAt",
                    isPost: "$chat.isPost",
                    postId: "$post._id",
                    postImageUrl: "$post.productImageUrls",
                    postDescription: "$post.description",
                    postIsBidding: "$post.isBidding",
                    postCreatedAt: "$post.createdAt",
                    postOwnerId: "$user._id",
                    postOwnerUserName: "$user.userName",
                    isPostReply: "$chat.isPostReply",
                },
            },
            {
                $sort: {
                    createdAt: 1,
                },
            },
        ]);
        return chats;
    };
    const getUnreadMessages = async (conversationId) => {
        const unreadMessages = await conversationModel_1.Conversation.aggregate([
            {
                $match: {
                    _id: conversationId,
                },
            },
        ]);
    };
    const getConversationsWithUserData = async (userId) => {
        const conversations = await conversationModel_1.Conversation.aggregate([
            {
                $match: {
                    participants: userId,
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "participants",
                    foreignField: "_id",
                    as: "participantsData",
                },
            },
            {
                $addFields: {
                    participantsData: {
                        $filter: {
                            input: "$participantsData",
                            as: "participant",
                            cond: { $ne: ["$$participant._id", userId] },
                        },
                    },
                },
            },
            {
                $project: {
                    _id: 1,
                    createdAt: 1,
                    participantsData: {
                        userName: 1,
                        imageUrl: 1,
                        createdAt: 1,
                        _id: 1,
                    },
                },
            },
        ]).exec();
        return conversations;
    };
    return {
        createConversation,
        getMessages,
        getUnreadMessages,
        getConversationsWithUserData,
    };
};
exports.conversationRepositoryMongoDb = conversationRepositoryMongoDb;
