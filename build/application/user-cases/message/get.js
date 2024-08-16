"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleGetConversations = exports.handleChangeMessageSeen = exports.handleGetUnreadMessageCount = exports.handleGetChat = void 0;
const mongoose_1 = require("mongoose");
const handleGetChat = async (recieverId, userToChatId, conversationRepository) => {
    const chats = await conversationRepository.getMessages(recieverId, userToChatId);
    return chats;
};
exports.handleGetChat = handleGetChat;
const handleGetUnreadMessageCount = async (senderId, receiverId, messageRepository) => {
    const unreadCount = await messageRepository.getUnseenMessagesCount(new mongoose_1.Types.ObjectId(senderId), new mongoose_1.Types.ObjectId(receiverId));
    return unreadCount;
};
exports.handleGetUnreadMessageCount = handleGetUnreadMessageCount;
const handleChangeMessageSeen = async (senderId, receiverId, messageRepository) => {
    await messageRepository.changeUnseenStatusConversationWise(new mongoose_1.Types.ObjectId(senderId), new mongoose_1.Types.ObjectId(receiverId));
    return;
};
exports.handleChangeMessageSeen = handleChangeMessageSeen;
const handleGetConversations = async (userId, conversationRepository) => {
    const conversations = await conversationRepository.getConversationsWithUserData(new mongoose_1.Types.ObjectId(userId));
    return conversations;
};
exports.handleGetConversations = handleGetConversations;
