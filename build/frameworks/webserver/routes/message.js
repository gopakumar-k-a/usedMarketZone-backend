"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const messageController_1 = require("../../../adapters/messageController/messageController");
const messageRepository_1 = require("../../../application/repositories/messageRepository");
const messageRepositoryMongoDb_1 = require("../../database/mongodb/repositories/messageRepositoryMongoDb");
const conversationRepository_1 = require("../../../application/repositories/conversationRepository");
const conversationRepositoryMongoDb_1 = require("../../database/mongodb/repositories/conversationRepositoryMongoDb");
const notificationRepository_1 = require("../../../application/repositories/notificationRepository");
const notificationRepositoryMongoDB_1 = require("../../database/mongodb/repositories/notificationRepositoryMongoDB");
const notificationServiceInterface_ts_1 = require("../../../application/services/notificationServiceInterface.ts");
const notificationService_1 = require("../../services/notificationService");
const messageRouter = () => {
    const router = express_1.default.Router();
    const controller = (0, messageController_1.messageController)(messageRepository_1.messageRepository, messageRepositoryMongoDb_1.messageRepositoryMongoDb, conversationRepository_1.conversationRepository, conversationRepositoryMongoDb_1.conversationRepositoryMongoDb, notificationRepository_1.notificationRepository, notificationRepositoryMongoDB_1.notificationRepositoryMongoDB, notificationServiceInterface_ts_1.notificationServiceInterface, notificationService_1.notificationService);
    router.post("/send-message/:userId", controller.sendNewMessage);
    router.post("/send-post/:userId", controller.sendPostAsMessage);
    router.post("/reply-post/:userId", controller.postReplyAsMessage);
    router.get("/get-chat/:userId", controller.getChat);
    router.get("/get-unread-messages/:userId", controller.getUnreadMessages);
    router.patch("/change-message-status/:userId", controller.changeReadMessageStatus);
    router.get("/get-conversations", controller.getConversations);
    return router;
};
exports.default = messageRouter;
