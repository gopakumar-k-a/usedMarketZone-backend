"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNotificationEntity = void 0;
const mongoose_1 = require("mongoose");
const createNotificationEntity = (notificationType, senderId, receiverId, status = "unread", postId, messageId, bidId, additionalInfo, priority = "medium", messageType) => {
    return {
        getNotificationType: () => notificationType,
        getSenderId: () => senderId ? new mongoose_1.Types.ObjectId(senderId) : null,
        getReceiverId: () => new mongoose_1.Types.ObjectId(receiverId),
        getStatus: () => status,
        getPostId: () => postId ? new mongoose_1.Types.ObjectId(postId) : undefined,
        getMessageId: () => messageId ? new mongoose_1.Types.ObjectId(messageId) : undefined,
        getBidId: () => bidId ? new mongoose_1.Types.ObjectId(bidId) : undefined,
        getAdditionalInfo: () => additionalInfo,
        getPriority: () => priority,
        getMessageType: () => messageType,
    };
};
exports.createNotificationEntity = createNotificationEntity;
