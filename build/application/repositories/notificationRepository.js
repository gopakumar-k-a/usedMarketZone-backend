"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationRepository = void 0;
const notificationRepository = (respository) => {
    const createNotification = async (notificationEntity) => await respository.createNotification(notificationEntity);
    const getNotifications = async (userId) => await respository.getNotifications(userId);
    const removeFollowNotification = async (senderId, receiverId) => respository.removeFollowNotification(senderId, receiverId);
    const changeUnreadStatusNotification = async (receiverId) => await respository.changeUnreadStatusNotification(receiverId);
    return {
        createNotification,
        getNotifications,
        removeFollowNotification,
        changeUnreadStatusNotification,
    };
};
exports.notificationRepository = notificationRepository;
