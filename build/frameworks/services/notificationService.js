"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationService = void 0;
const app_1 = require("../../app"); // adjust the path to your socket config
const socket_1 = require("../webSocket/socket");
const notificationService = () => {
    const sendRealTimeNotification = (recieverId, notificationType, newNotification, additionalInfo) => {
        const recieverSocketId = (0, socket_1.getRecieverSocketId)(recieverId);
        if (recieverSocketId) {
            const notificationData = {
                title: "You have a new notification",
                description: "",
                senderId: newNotification.senderId,
                additionalInfo: "",
                notificationType,
                newNotification,
            };
            switch (notificationType) {
                case "message":
                    notificationData.title = "You have a new message";
                    notificationData.description = `${newNotification.senderId.userName} sent a new message to you`;
                    notificationData.additionalInfo = additionalInfo?.message || "";
                    break;
                case "comment":
                    notificationData.title = "New comment on your post";
                    notificationData.description = `${newNotification.senderId.userName} commented on your post`;
                    notificationData.additionalInfo = additionalInfo?.comment || "";
                    break;
                case "outBid":
                    notificationData.title = "outbid on a item";
                    notificationData.description = `${newNotification.senderId.userName} on you bid`;
                    notificationData.additionalInfo = additionalInfo?.bid || "";
                    break;
                case "bidWin":
                    notificationData.title = "Bid Won";
                    notificationData.description = `You won Bid Product Product Id`;
                    notificationData.additionalInfo = additionalInfo?.bid || "";
                    break;
                case "bidLose":
                    notificationData.title = "Bid Lose";
                    notificationData.description = `You Lose Bid On Product productId`;
                    notificationData.additionalInfo = additionalInfo?.bid || "";
                    break;
                case "follow":
                    notificationData.title = "New follower";
                    notificationData.description = `${newNotification.senderId.userName} started following you`;
                    break;
                default:
                    notificationData.title = "You have a new notification";
                    notificationData.description = "You have a new notification";
                    break;
            }
            app_1.io.to(recieverSocketId).emit("notification", notificationData);
        }
    };
    return {
        sendRealTimeNotification,
    };
};
exports.notificationService = notificationService;
