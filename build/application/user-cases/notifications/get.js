"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleGetUserNotifications = void 0;
const handleGetUserNotifications = async (userId, notificationDb) => {
    const notifications = await notificationDb.getNotifications(userId);
    return notifications;
};
exports.handleGetUserNotifications = handleGetUserNotifications;
