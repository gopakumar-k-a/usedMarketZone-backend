"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSendPostEntity = void 0;
const mongoose_1 = require("mongoose");
const createSendPostEntity = (senderId, recieverId, postId) => {
    return {
        getSenderId: () => new mongoose_1.Types.ObjectId(senderId),
        getRecieverId: () => new mongoose_1.Types.ObjectId(recieverId),
        getPostId: () => new mongoose_1.Types.ObjectId(postId),
    };
};
exports.createSendPostEntity = createSendPostEntity;
