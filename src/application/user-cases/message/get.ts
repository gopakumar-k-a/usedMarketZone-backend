import { Types } from "mongoose";
import { ConversationDbRepository } from "../../repositories/conversationRepository";
import { MessageDbRepository } from "../../repositories/messageRepository";

export const handleGetChat = async (
  recieverId: string,
  userToChatId: string,
  conversationRepository: ConversationDbRepository
) => {
  const chats = await conversationRepository.getMessages(
    recieverId,
    userToChatId
  );

  return chats;
};

export const handleGetUnreadMessageCount = async (
  senderId: string,
  receiverId: string,
  messageRepository: MessageDbRepository
) => {
  const unreadCount = await messageRepository.getUnseenMessagesCount(
    new Types.ObjectId(senderId),
    new Types.ObjectId(receiverId)
  );

  return unreadCount;
};

export const handleChangeMessageSeen = async (
  senderId: string,
  receiverId: string,
  messageRepository: MessageDbRepository
) => {
  await messageRepository.changeUnseenStatusConversationWise(
    new Types.ObjectId(senderId),
    new Types.ObjectId(receiverId)
  );

  return;
};

export const handleGetConversations = async (
  userId: string,
  conversationRepository: ConversationDbRepository
) => {
  const conversations =
    await conversationRepository.getConversationsWithUserData(
      new Types.ObjectId(userId)
    );

  return conversations;
};
