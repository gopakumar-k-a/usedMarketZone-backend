"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationServiceInterface = void 0;
const notificationServiceInterface = (service) => {
    const sendRealTimeNotification = (recieverId, notificationType, newNotification, additionalInfo) => service.sendRealTimeNotification(recieverId, notificationType, newNotification, additionalInfo);
    return {
        sendRealTimeNotification,
    };
};
exports.notificationServiceInterface = notificationServiceInterface;
