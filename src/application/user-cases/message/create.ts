import { Types } from "mongoose";
import { createConversationEntity } from "../../../entities/createConversationEntity";
import { createMessageEntity } from "../../../entities/createMessageEntity";
import { createSendPostEntity } from "../../../entities/createSendPostEntity";
import { ConversationDbRepository } from "../../repositories/conversationRepository";
import { MessageDbRepository } from "../../repositories/messageRepository";
import AppError from "../../../utils/appError";
import { HttpStatusCodes } from "../../../types/httpStatusCodes";
import { getRecieverSocketId } from "../../../frameworks/webSocket/socket";
import { io } from "../../../app";
import { createPostReplyMessageEntity } from "../../../entities/createPostReplyMessageEntity";
// import socketConfig from "../../../frameworks/webSocket/socket";

export const handleSendNewMessage = async (
  senderId: string,
  recieverId: string,
  message: string,
  messageRepository: MessageDbRepository,
  conversationRepository: ConversationDbRepository
) => {
  const newMessageEntity = createMessageEntity(senderId, recieverId, message);
  console.log("newMessageEntity ", newMessageEntity);
  const newMessage = await messageRepository.sendNewMessage(newMessageEntity);
  console.log("newMessage ", newMessage);

  if (!newMessage) {
    throw new AppError("cant send message ", HttpStatusCodes.BAD_REQUEST);
  }

  const conversationEntity = createConversationEntity(
    senderId,
    recieverId,
    newMessage._id as Types.ObjectId
  );

  // const recieverId=socketConfig.getRecieverId()
  await conversationRepository.createConversation(conversationEntity);

  const recieverSocketId = getRecieverSocketId(recieverId);
  console.log("recieverSocketId ", recieverSocketId);

  if (recieverSocketId) {
    io.to(recieverSocketId).emit("newMessage", newMessage);
  }

  return newMessage;
};



export const handleSendPostAsMessage = async (
  senderId: string,
  recieverId: string,
  productId: string,
  messageRepository: MessageDbRepository,
  conversationRepository: ConversationDbRepository
) => {
  const newPostMessageEntity = createSendPostEntity(senderId, recieverId, productId);
  console.log("newMessageEntity ", newPostMessageEntity);
  const newMessagePostMessage = await messageRepository.sendPostAsMessage(newPostMessageEntity);
  console.log("newMessage ", newMessagePostMessage);

  if (!newMessagePostMessage) {
    throw new AppError("cant send message ", HttpStatusCodes.BAD_REQUEST);
  }

  const conversationEntity = createConversationEntity(
    senderId,
    recieverId,
    newMessagePostMessage._id as Types.ObjectId
  );

  // const recieverId=socketConfig.getRecieverId()
  await conversationRepository.createConversation(conversationEntity);

  const recieverSocketId = getRecieverSocketId(recieverId);
  console.log("recieverSocketId ", recieverSocketId);

  if (recieverSocketId) {
    io.to(recieverSocketId).emit("newMessage", newMessagePostMessage);
  }

  return newMessagePostMessage;
};

export const handlePostReplyAsMessage = async (
  senderId: string,
  recieverId: string,
  productId:string,
  message: string,
  messageRepository: MessageDbRepository,
  conversationRepository: ConversationDbRepository
) => {
  // const newMessageEntity = createMessageEntity(senderId, recieverId, message);
  const newPostMessageReplyEntity = createPostReplyMessageEntity(senderId, recieverId,productId, message);
  console.log("newPostMessageReplyEntity ", newPostMessageReplyEntity);
  const newPostReplyMessage = await messageRepository.sendPostReplyAsMessage(newPostMessageReplyEntity);
  console.log("newMessage ", newPostReplyMessage);

  if (!newPostReplyMessage) {
    throw new AppError("cant send message ", HttpStatusCodes.BAD_REQUEST);
  }

  const conversationEntity = createConversationEntity(
    senderId,
    recieverId,
    newPostReplyMessage._id as Types.ObjectId
  );

  // const recieverId=socketConfig.getRecieverId()
  await conversationRepository.createConversation(conversationEntity);

  const recieverSocketId = getRecieverSocketId(recieverId);
  console.log("recieverSocketId ", recieverSocketId);

  if (recieverSocketId) {
    io.to(recieverSocketId).emit("newMessage", newPostReplyMessage);
  }

  return newPostReplyMessage;
};


