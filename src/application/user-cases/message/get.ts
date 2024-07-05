import { ConversationDbRepository } from "../../repositories/conversationRepository";

export const handleGetChat = async (
  sendId: string,
  userToChatId: string,
  conversationRepository: ConversationDbRepository
) => {
  const chat=await conversationRepository.getMessages(sendId, userToChatId);

  return chat
};
