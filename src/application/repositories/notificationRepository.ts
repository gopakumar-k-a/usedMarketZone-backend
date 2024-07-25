import { CreateNotificationEntityType } from "../../entities/createNotificationEntity";
import { NotificationRepositoryMongoDB } from "../../frameworks/database/mongodb/repositories/notificationRepositoryMongoDB";

export const notificationRepository = (
  respository: ReturnType<NotificationRepositoryMongoDB>
) => {
  const createNotification = async (
    notificationEntity: CreateNotificationEntityType
  ) => await respository.createNotification(notificationEntity);

  const getNotifications = async (userId: string) =>
    await respository.getNotifications(userId);

  const removeFollowNotification = async (
    senderId: string,
    receiverId: string
  ) => respository.removeFollowNotification(senderId, receiverId);

  const changeUnreadStatusNotification = async (receiverId: string) =>
    await respository.changeUnreadStatusNotification(receiverId);
  return {
    createNotification,
    getNotifications,
    removeFollowNotification,
    changeUnreadStatusNotification,
  };
};

export type NotificationInterface = typeof notificationRepository;

export type NotificationRepository = ReturnType<typeof notificationRepository>;
