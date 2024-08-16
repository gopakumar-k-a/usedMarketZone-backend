"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationRepositoryMongoDB = void 0;
const notificationModel_1 = __importDefault(require("../models/notificationModel"));
const appError_1 = __importDefault(require("../../../../utils/appError"));
const httpStatusCodes_1 = require("../../../../types/httpStatusCodes");
const notificationRepositoryMongoDB = () => {
    const createNotification = async (notificationEntity) => {
        try {
            const newNotification = await notificationModel_1.default.create({
                notificationType: notificationEntity.getNotificationType(),
                postId: notificationEntity.getPostId(),
                messageId: notificationEntity.getMessageId(),
                bidId: notificationEntity.getBidId(),
                senderId: notificationEntity.getSenderId(),
                receiverId: notificationEntity.getReceiverId(),
                status: notificationEntity.getStatus(),
                additionalInfo: notificationEntity.getAdditionalInfo(),
                priority: notificationEntity.getPriority(),
            });
            const populatedNotification = await notificationModel_1.default.findById(newNotification._id)
                .populate({
                path: "senderId",
                select: "userName imageUrl",
            })
                .populate({
                path: "postId",
                select: "productImageUrls",
            })
                .populate({
                path: "messageId",
                select: "message",
            })
                .exec();
            return populatedNotification;
        }
        catch (error) {
            throw new appError_1.default("faliled To CreateNotification", httpStatusCodes_1.HttpStatusCodes.BAD_GATEWAY);
        }
    };
    const getNotifications = async (userId) => {
        const notifications = await notificationModel_1.default.find({ receiverId: userId })
            .populate({
            path: "senderId",
            select: "userName imageUrl",
        })
            .populate({
            path: "postId",
            select: "productImageUrls productName",
        })
            .populate({
            path: "messageId",
            select: "message",
        })
            .sort({ createdAt: -1 })
            .exec();
        return notifications;
    };
    const removeFollowNotification = async (senderId, receiverId) => {
        await notificationModel_1.default.findOneAndDelete({
            senderId: senderId,
            receiverId: receiverId,
            notificationType: "follow",
        });
        return;
    };
    const changeUnreadStatusNotification = async (receiverId) => {
        await notificationModel_1.default.updateMany({ receiverId, status: "unread" }, { status: "read" });
        return;
    };
    return {
        createNotification,
        getNotifications,
        removeFollowNotification,
        changeUnreadStatusNotification,
    };
};
exports.notificationRepositoryMongoDB = notificationRepositoryMongoDB;
