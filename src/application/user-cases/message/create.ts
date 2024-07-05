import { Types } from "mongoose";
import { createConversationEntity } from "../../../entities/createConversationEntity";
import { createMessageEntity } from "../../../entities/createMessageEntity";
import { ConversationDbRepository } from "../../repositories/conversationRepository";
import { MessageDbRepository } from "../../repositories/messageRepository";
import AppError from "../../../utils/appError";
import { HttpStatusCodes } from "../../../types/httpStatusCodes";

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

  await conversationRepository.createConversation(conversationEntity);

  return newMessage;

};
