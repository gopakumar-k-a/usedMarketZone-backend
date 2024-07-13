import express from "express";
import { messageController } from "../../../adapters/messageController/messageController";
import { messageRepository } from "../../../application/repositories/messageRepository";
import { messageRepositoryMongoDb } from "../../database/mongodb/repositories/messageRepositoryMongoDb";
import { conversationRepository } from "../../../application/repositories/conversationRepository";
import { conversationRepositoryMongoDb } from "../../database/mongodb/repositories/conversationRepositoryMongoDb";
const messageRouter = () => {
  const router = express.Router();
  const controller = messageController(messageRepository,messageRepositoryMongoDb,conversationRepository,conversationRepositoryMongoDb);

  router.post("/send-message/:userId",controller.sendNewMessage);
  router.post("/send-post/:userId",controller.sendPostAsMessage)
  router.post("/reply-post/:userId",controller.postReplyAsMessage)
  router.get("/get-chat/:userId",controller.getChat)

  return router;
};

export default messageRouter;
