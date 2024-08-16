"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const NotificationSchema = new mongoose_1.Schema({
    notificationType: {
        type: String,
        enum: ["comment", "outBid", "bidWin", "bidLose", "message", "follow"],
        required: true,
    },
    postId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Product",
        required: function () {
            return this.notificationType === "comment";
        },
    },
    messageId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Messages",
        required: function () {
            return this.notificationType === "message";
        },
    },
    bidId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "bid",
        required: function () {
            return (this.notificationType === "outBid" ||
                this.notificationType === "bidWin" ||
                this.notificationType === "bidLose");
        },
    },
    senderId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
    },
    receiverId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    status: {
        type: String,
        enum: ["read", "unread"],
        default: "unread",
        required: true,
    },
    additionalInfo: {
        type: String,
        default: "",
    },
    priority: {
        type: String,
        enum: ["low", "medium", "high"],
        default: "medium",
    },
}, {
    timestamps: true,
});
const Notification = mongoose_1.default.model("Notification", NotificationSchema);
exports.default = Notification;