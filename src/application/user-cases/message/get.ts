import { ConversationDbRepository } from "../../repositories/conversationRepository";

export const handleGetChat = async (
  recieverId: string,
  userToChatId: string,
  conversationRepository: ConversationDbRepository
) => {
  const chats=await conversationRepository.getMessages(recieverId, userToChatId);

  return chats
};
