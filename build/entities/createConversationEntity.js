"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConversationEntity = void 0;
const mongoose_1 = require("mongoose");
const createConversationEntity = (senderId, recieverId, messageId) => {
    return {
        getSenderId: () => new mongoose_1.Types.ObjectId(senderId),
        getRecieverId: () => new mongoose_1.Types.ObjectId(recieverId),
        getMessageId: () => messageId,
    };
};
exports.createConversationEntity = createConversationEntity;
