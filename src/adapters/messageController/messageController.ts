import asyncHandler from "express-async-handler";
import { ExtendedRequest } from "../../types/extendedRequest";
import { Response } from "express";
import { CreateUserInterface } from "../../types/userInterface";
import { MessageRepositoryInterface } from "../../application/repositories/messageRepository";
import { MessageRepositoryMongoDb } from "../../frameworks/database/mongodb/repositories/messageRepositoryMongoDb";
import { ConversationInterface } from "../../application/repositories/conversationRepository";
import { ConversationRepositoryMongoDb } from "../../frameworks/database/mongodb/repositories/conversationRepositoryMongoDb";
import { handleSendNewMessage } from "../../application/user-cases/message/create";
import { HttpStatusCodes } from "../../types/httpStatusCodes";
import { handleGetChat } from "../../application/user-cases/message/get";

export const messageController = (
  messageDbRepository: MessageRepositoryInterface,
  messageDbImpl: MessageRepositoryMongoDb,
  conversationDbRepository: ConversationInterface,
  conversationDbImpl: ConversationRepositoryMongoDb
) => {
  const dbRepositoryMessage = messageDbRepository(messageDbImpl());
  const dbRepositoryConversation = conversationDbRepository(
    conversationDbImpl()
  );

  const sendNewMessage = asyncHandler(
    async (req: ExtendedRequest, res: Response) => {
      const { _id } = req.user as CreateUserInterface;
      const { userId: recieverId } = req.params;
      const { message } = req.body;

      const newMessage = await handleSendNewMessage(
        _id,
        recieverId,
        message,
        dbRepositoryMessage,
        dbRepositoryConversation
      );

      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: "message send success",
        newMessage,
      });
    }
  );

  const getChat = asyncHandler(async (req: ExtendedRequest, res: Response) => {
    const { _id } = req.user as CreateUserInterface;
    const { userId: senderId } = req.params;

    console.log("inside get chat");

    const chat = await handleGetChat(_id, senderId, dbRepositoryConversation);

    res.status(HttpStatusCodes.OK).json({
      success: true,
      message: "chat retrived successfully",
      chat,
    });
  });

  return { sendNewMessage, getChat };
};
