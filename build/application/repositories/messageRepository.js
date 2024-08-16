"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageRepository = void 0;
const messageRepository = (repository) => {
    const sendNewMessage = async (messageEntity) => await repository.sendNewMessage(messageEntity);
    const sendPostAsMessage = async (sendPostEntity) => await repository.sendPostAsMessage(sendPostEntity);
    const sendPostReplyAsMessage = async (sendPostReplyEntity) => await repository.sendPostReplyAsMessage(sendPostReplyEntity);
    const getUnseenMessagesCount = async (senderId, receiverId) => await repository.getUnseenMessagesCount(senderId, receiverId);
    const changeUnseenStatusConversationWise = async (senderId, recieverId) => await repository.changeUnseenStatusConversationWise(senderId, recieverId);
    return {
        sendNewMessage,
        sendPostAsMessage,
        sendPostReplyAsMessage,
        getUnseenMessagesCount,
        changeUnseenStatusConversationWise
    };
};
exports.messageRepository = messageRepository;
