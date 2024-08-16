"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageController = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const create_1 = require("../../application/user-cases/message/create");
const httpStatusCodes_1 = require("../../types/httpStatusCodes");
const get_1 = require("../../application/user-cases/message/get");
const messageController = (messageDbRepository, messageDbImpl, conversationDbRepository, conversationDbImpl, notificationDbRepository, notificationDbImpl, notificationServiceInterface, notificationServiceImpl) => {
    const dbRepositoryMessage = messageDbRepository(messageDbImpl());
    const dbRepositoryConversation = conversationDbRepository(conversationDbImpl());
    const dbNotification = notificationDbRepository(notificationDbImpl());
    const notificationService = notificationServiceInterface(notificationServiceImpl());
    const getConversations = (0, express_async_handler_1.default)(async (req, res) => {
        const { _id } = req.user;
        const conversations = await (0, get_1.handleGetConversations)(_id, dbRepositoryConversation);
        res.status(httpStatusCodes_1.HttpStatusCodes.OK).json({
            success: true,
            message: "conversations data retirieved succuss",
            conversations,
        });
    });
    const sendNewMessage = (0, express_async_handler_1.default)(async (req, res) => {
        const { _id } = req.user;
        const { userId: recieverId } = req.params;
        const { message } = req.body;
        const newMessage = await (0, create_1.handleSendNewMessage)(_id, recieverId, message, dbRepositoryMessage, dbRepositoryConversation);
        res.status(httpStatusCodes_1.HttpStatusCodes.OK).json({
            success: true,
            message: "message send success",
            newMessage,
        });
    });
    const sendPostAsMessage = (0, express_async_handler_1.default)(async (req, res) => {
        const { _id } = req.user;
        const { userId: recieverId } = req.params;
        const { productId } = req.body;
        const newMessage = await (0, create_1.handleSendPostAsMessage)(_id, recieverId, productId, dbRepositoryMessage, dbRepositoryConversation);
        res.status(httpStatusCodes_1.HttpStatusCodes.OK).json({
            success: true,
            message: "post sended successfully",
            newMessage,
        });
    });
    const getChat = (0, express_async_handler_1.default)(async (req, res) => {
        const { _id } = req.user;
        const { userId: recieverId } = req.params;
        const chats = await (0, get_1.handleGetChat)(_id, recieverId, dbRepositoryConversation);
        res.status(httpStatusCodes_1.HttpStatusCodes.OK).json({
            success: true,
            message: "chat retrived successfully",
            chats,
        });
    });
    const postReplyAsMessage = (0, express_async_handler_1.default)(async (req, res) => {
        const { _id } = req.user;
        const { userId: recieverId } = req.params;
        const { productId, message } = req.body;
        const newMessage = await (0, create_1.handlePostReplyAsMessage)(_id, recieverId, productId, message, dbRepositoryMessage, dbRepositoryConversation);
        res.status(httpStatusCodes_1.HttpStatusCodes.OK).json({
            success: true,
            message: "Reply message To Post Send Successfully",
            newMessage,
        });
    });
    const getUnreadMessages = (0, express_async_handler_1.default)(async (req, res) => {
        const { _id: recieverId } = req.user;
        const { userId: senderId } = req.params;
        const unreadCount = await (0, get_1.handleGetUnreadMessageCount)(senderId, recieverId, dbRepositoryMessage);
        res.status(httpStatusCodes_1.HttpStatusCodes.OK).json({
            success: true,
            message: "unread messages fetched successfully",
            unreadCount,
        });
    });
    const changeReadMessageStatus = (0, express_async_handler_1.default)(async (req, res) => {
        const { _id: recieverId } = req.user;
        const { userId: senderId } = req.params;
        await (0, get_1.handleChangeMessageSeen)(senderId, recieverId, dbRepositoryMessage);
        res.status(httpStatusCodes_1.HttpStatusCodes.OK).json({
            success: true,
            message: "message Status changed successfully",
        });
    });
    return {
        sendNewMessage,
        sendPostAsMessage,
        getChat,
        postReplyAsMessage,
        getUnreadMessages,
        changeReadMessageStatus,
        getConversations,
    };
};
exports.messageController = messageController;
