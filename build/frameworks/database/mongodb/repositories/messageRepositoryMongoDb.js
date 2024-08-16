"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageRepositoryMongoDb = void 0;
const messageModel_1 = require("../models/messageModel");
const messageRepositoryMongoDb = () => {
    const sendNewMessage = async (messageEntity) => {
        const newMessage = new messageModel_1.Messages({
            senderId: messageEntity.getSenderId(),
            recieverId: messageEntity.getRecieverId(),
            message: messageEntity.getMessage(),
        });
        await newMessage.save();
        return newMessage;
    };
    const sendPostAsMessage = async (sendPostEntity) => {
        const newMessage = new messageModel_1.Messages({
            senderId: sendPostEntity.getSenderId(),
            recieverId: sendPostEntity.getRecieverId(),
            postId: sendPostEntity.getPostId(),
            isPost: true,
        });
        await newMessage.save();
        return newMessage;
    };
    const sendPostReplyAsMessage = async (sendPostReplyEntity) => {
        const newPostReplyMessage = new messageModel_1.Messages({
            senderId: sendPostReplyEntity.getSenderId(),
            recieverId: sendPostReplyEntity.getRecieverId(),
            message: sendPostReplyEntity.getMessage(),
            postId: sendPostReplyEntity.getPostId(),
            isPostReply: true,
        });
        await newPostReplyMessage.save();
        return newPostReplyMessage;
    };
    const getUnseenMessagesCount = async (senderId, recieverId) => {
        const unseenMessagesCount = await messageModel_1.Messages.aggregate([
            {
                $match: {
                    senderId: senderId,
                    recieverId: recieverId,
                    isSeen: false,
                },
            },
            {
                $group: {
                    _id: null,
                    unseenCount: {
                        $sum: 1,
                    },
                },
            },
        ]);
        return unseenMessagesCount.length > 0
            ? unseenMessagesCount[0].unseenCount
            : 0;
    };
    const changeUnseenStatusConversationWise = async (senderId, recieverId) => {
        const updateResult = await messageModel_1.Messages.updateMany({
            senderId: senderId,
            recieverId: recieverId,
            isSeen: false,
        }, { $set: { isSeen: true } });
        return;
    };
    return {
        sendNewMessage,
        sendPostAsMessage,
        sendPostReplyAsMessage,
        getUnseenMessagesCount,
        changeUnseenStatusConversationWise,
    };
};
exports.messageRepositoryMongoDb = messageRepositoryMongoDb;
