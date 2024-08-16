"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPostReplyMessageEntity = void 0;
const mongoose_1 = require("mongoose");
const createPostReplyMessageEntity = (senderId, recieverId, productId, message) => {
    return {
        getSenderId: () => new mongoose_1.Types.ObjectId(senderId),
        getRecieverId: () => new mongoose_1.Types.ObjectId(recieverId),
        getPostId: () => new mongoose_1.Types.ObjectId(productId),
        getMessage: () => message
    };
};
exports.createPostReplyMessageEntity = createPostReplyMessageEntity;
