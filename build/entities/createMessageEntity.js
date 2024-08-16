"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMessageEntity = void 0;
const mongoose_1 = require("mongoose");
const createMessageEntity = (senderId, recieverId, message) => {
    return {
        getSenderId: () => new mongoose_1.Types.ObjectId(senderId),
        getRecieverId: () => new mongoose_1.Types.ObjectId(recieverId),
        getMessage: () => message
    };
};
exports.createMessageEntity = createMessageEntity;
