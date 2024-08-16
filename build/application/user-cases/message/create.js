"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlePostReplyAsMessage = exports.handleSendPostAsMessage = exports.handleSendNewMessage = void 0;
const createConversationEntity_1 = require("../../../entities/createConversationEntity");
const createMessageEntity_1 = require("../../../entities/createMessageEntity");
const createSendPostEntity_1 = require("../../../entities/createSendPostEntity");
const appError_1 = __importDefault(require("../../../utils/appError"));
const httpStatusCodes_1 = require("../../../types/httpStatusCodes");
const socket_1 = require("../../../frameworks/webSocket/socket");
const app_1 = require("../../../app");
const createPostReplyMessageEntity_1 = require("../../../entities/createPostReplyMessageEntity");
const createNotificationEntity_1 = require("../../../entities/createNotificationEntity");
const handleSendNewMessage = async (senderId, recieverId, message, messageRepository, conversationRepository) => {
    const newMessageEntity = (0, createMessageEntity_1.createMessageEntity)(senderId, recieverId, message);
    const newMessage = await messageRepository.sendNewMessage(newMessageEntity);
    if (!newMessage) {
        throw new appError_1.default("cant send message ", httpStatusCodes_1.HttpStatusCodes.BAD_REQUEST);
    }
    const conversationEntity = (0, createConversationEntity_1.createConversationEntity)(senderId, recieverId, newMessage._id);
    const conversationId = await conversationRepository.createConversation(conversationEntity);
    const recieverSocketId = (0, socket_1.getRecieverSocketId)(recieverId);
    const newNotificationEntity = (0, createNotificationEntity_1.createNotificationEntity)("message", senderId, recieverId, "unread", undefined, String(newMessage._id), undefined, undefined, "medium", "normal");
    if (recieverSocketId) {
        app_1.io.to(recieverSocketId).emit("newMessage", newMessage);
    }
    return newMessage;
};
exports.handleSendNewMessage = handleSendNewMessage;
const handleSendPostAsMessage = async (senderId, recieverId, productId, messageRepository, conversationRepository) => {
    const newPostMessageEntity = (0, createSendPostEntity_1.createSendPostEntity)(senderId, recieverId, productId);
    const newMessagePostMessage = await messageRepository.sendPostAsMessage(newPostMessageEntity);
    if (!newMessagePostMessage) {
        throw new appError_1.default("cant send message ", httpStatusCodes_1.HttpStatusCodes.BAD_REQUEST);
    }
    const conversationEntity = (0, createConversationEntity_1.createConversationEntity)(senderId, recieverId, newMessagePostMessage._id);
    await conversationRepository.createConversation(conversationEntity);
    const recieverSocketId = (0, socket_1.getRecieverSocketId)(recieverId);
    if (recieverSocketId) {
        app_1.io.to(recieverSocketId).emit("newMessage", newMessagePostMessage);
    }
    return newMessagePostMessage;
};
exports.handleSendPostAsMessage = handleSendPostAsMessage;
const handlePostReplyAsMessage = async (senderId, recieverId, productId, message, messageRepository, conversationRepository) => {
    const newPostMessageReplyEntity = (0, createPostReplyMessageEntity_1.createPostReplyMessageEntity)(senderId, recieverId, productId, message);
    const newPostReplyMessage = await messageRepository.sendPostReplyAsMessage(newPostMessageReplyEntity);
    if (!newPostReplyMessage) {
        throw new appError_1.default("cant send message ", httpStatusCodes_1.HttpStatusCodes.BAD_REQUEST);
    }
    const conversationEntity = (0, createConversationEntity_1.createConversationEntity)(senderId, recieverId, newPostReplyMessage._id);
    await conversationRepository.createConversation(conversationEntity);
    const recieverSocketId = (0, socket_1.getRecieverSocketId)(recieverId);
    if (recieverSocketId) {
        app_1.io.to(recieverSocketId).emit("newMessage", newPostReplyMessage);
    }
    return newPostReplyMessage;
};
exports.handlePostReplyAsMessage = handlePostReplyAsMessage;
