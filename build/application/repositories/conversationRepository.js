"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.conversationRepository = void 0;
const conversationRepository = (repository) => {
    const createConversation = async (conversationEntity) => await repository.createConversation(conversationEntity);
    const getMessages = async (recieverId, userToChatId) => repository.getMessages(recieverId, userToChatId);
    const getConversationsWithUserData = async (userId) => await repository.getConversationsWithUserData(userId);
    return {
        createConversation,
        getMessages,
        getConversationsWithUserData
    };
};
exports.conversationRepository = conversationRepository;
