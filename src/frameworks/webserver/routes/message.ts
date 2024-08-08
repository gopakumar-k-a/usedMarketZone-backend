import express from "express";
import { messageController } from "../../../adapters/messageController/messageController";
import { messageRepository } from "../../../application/repositories/messageRepository";
import { messageRepositoryMongoDb } from "../../database/mongodb/repositories/messageRepositoryMongoDb";
import { conversationRepository } from "../../../application/repositories/conversationRepository";
import { conversationRepositoryMongoDb } from "../../database/mongodb/repositories/conversationRepositoryMongoDb";
import { notificationRepository } from "../../../application/repositories/notificationRepository";
import { notificationRepositoryMongoDB } from "../../database/mongodb/repositories/notificationRepositoryMongoDB";
import { notificationServiceInterface } from "../../../application/services/notificationServiceInterface.ts";
import { notificationService } from "../../services/notificationService";
const messageRouter = () => {
  const router = express.Router();
  const controller = messageController(
    messageRepository,
    messageRepositoryMongoDb,
    conversationRepository,
    conversationRepositoryMongoDb,
    notificationRepository,
    notificationRepositoryMongoDB,
    notificationServiceInterface,
    notificationService
  );

  router.post("/send-message/:userId", controller.sendNewMessage);
  router.post("/send-post/:userId", controller.sendPostAsMessage);
  router.post("/reply-post/:userId", controller.postReplyAsMessage);
  router.get("/get-chat/:userId", controller.getChat);
  router.get("/get-unread-messages/:userId", controller.getUnreadMessages);
  router.patch(
    "/change-message-status/:userId",
    controller.changeReadMessageStatus
  );

  router.get("/get-conversations", controller.getConversations);
  return router;
};

export default messageRouter;
