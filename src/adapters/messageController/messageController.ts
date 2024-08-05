import asyncHandler from "express-async-handler";
import { ExtendedRequest } from "../../types/extendedRequest";
import { Response } from "express";
import { CreateUserInterface } from "../../types/userInterface";
import { MessageRepositoryInterface } from "../../application/repositories/messageRepository";
import { MessageRepositoryMongoDb } from "../../frameworks/database/mongodb/repositories/messageRepositoryMongoDb";
import { ConversationInterface } from "../../application/repositories/conversationRepository";
import { ConversationRepositoryMongoDb } from "../../frameworks/database/mongodb/repositories/conversationRepositoryMongoDb";
import {
  handlePostReplyAsMessage,
  handleSendNewMessage,
  handleSendPostAsMessage,
} from "../../application/user-cases/message/create";
import { HttpStatusCodes } from "../../types/httpStatusCodes";
import {
  handleChangeMessageSeen,
  handleGetChat,
  handleGetUnreadMessageCount,
} from "../../application/user-cases/message/get";
import { NotificationInterface } from "../../application/repositories/notificationRepository";
import { NotificationRepositoryMongoDB } from "../../frameworks/database/mongodb/repositories/notificationRepositoryMongoDB";
import { NotificationService } from "../../frameworks/services/notificationService";
import { NotificationServiceInterface } from "../../application/services/notificationServiceInterface.ts";

export const messageController = (
  messageDbRepository: MessageRepositoryInterface,
  messageDbImpl: MessageRepositoryMongoDb,
  conversationDbRepository: ConversationInterface,
  conversationDbImpl: ConversationRepositoryMongoDb,
  notificationDbRepository: NotificationInterface,
  notificationDbImpl: NotificationRepositoryMongoDB,
  notificationServiceInterface:NotificationServiceInterface,
  notificationServiceImpl:NotificationService
) => {
  const dbRepositoryMessage = messageDbRepository(messageDbImpl());
  const dbRepositoryConversation = conversationDbRepository(
    conversationDbImpl()
  );
  const dbNotification = notificationDbRepository(notificationDbImpl());

const notificationService=notificationServiceInterface(notificationServiceImpl())
  const sendNewMessage = asyncHandler(
    async (req: ExtendedRequest, res: Response) => {
      const { _id } = req.user as CreateUserInterface;
      const { userId: recieverId } = req.params;

      console.log("sender id controller", _id);
      console.log("reciever id controller ", recieverId);

      const { message } = req.body;

      const newMessage = await handleSendNewMessage(
        _id,
        recieverId,
        message,
        dbRepositoryMessage,
        dbRepositoryConversation,
        dbNotification,
        notificationService

      );

      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: "message send success",
        newMessage,
      });
    }
  );

  const sendPostAsMessage = asyncHandler(
    async (req: ExtendedRequest, res: Response) => {
      const { _id } = req.user as CreateUserInterface;
      const { userId: recieverId } = req.params;
      const { productId } = req.body;
      // export const handleSendPostAsMessage = async (
      //   senderId: string,
      //   recieverId: string,
      //   productId: string,
      const newMessage = await handleSendPostAsMessage(
        _id,
        recieverId,
        productId,
        dbRepositoryMessage,
        dbRepositoryConversation,
        dbNotification,
      );

      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: "post sended successfully",
        newMessage,
      });
    }
  );

  const getChat = asyncHandler(async (req: ExtendedRequest, res: Response) => {
    const { _id } = req.user as CreateUserInterface;
    const { userId: recieverId } = req.params;

    console.log("inside get chat");

    const chats = await handleGetChat(
      _id,
      recieverId,
      dbRepositoryConversation
    );

    console.log("chats ", chats);

    res.status(HttpStatusCodes.OK).json({
      success: true,
      message: "chat retrived successfully",
      chats,
    });
  });

  const postReplyAsMessage = asyncHandler(
    async (req: ExtendedRequest, res: Response) => {
      const { _id } = req.user as CreateUserInterface;
      const { userId: recieverId } = req.params;
      const { productId, message } = req.body;

      const newMessage = await handlePostReplyAsMessage(
        _id,
        recieverId,
        productId,
        message,
        dbRepositoryMessage,
        dbRepositoryConversation,
        dbNotification
      );

      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: "Reply message To Post Send Successfully",
        newMessage,
      });
    }
  );

  const getUnreadMessages = asyncHandler(
    async (req: ExtendedRequest, res: Response) => {
      const { _id: recieverId } = req.user as CreateUserInterface;
      const { userId: senderId } = req.params;

      const unreadCount = await handleGetUnreadMessageCount(
        senderId,
        recieverId,
        dbRepositoryMessage
      );

      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: "unread messages fetched successfully",
        unreadCount,
      });
    }
  );
  const changeReadMessageStatus = asyncHandler(
    async (req: ExtendedRequest, res: Response) => {
      const { _id: recieverId } = req.user as CreateUserInterface;
      const { userId: senderId } = req.params;

      await handleChangeMessageSeen(senderId, recieverId, dbRepositoryMessage);

      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: "message Status changed successfully",
      });
    }
  );

  return {
    sendNewMessage,
    sendPostAsMessage,
    getChat,
    postReplyAsMessage,
    getUnreadMessages,
    changeReadMessageStatus
  };
};
