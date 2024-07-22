import { CreateNotificationEntityType } from "../../entities/createNotificationEntity";
import { NotificationRepositoryMongoDB } from "../../frameworks/database/mongodb/repositories/notificationRepositoryMongoDB";

export const notificationRepository = (
  respository: ReturnType<NotificationRepositoryMongoDB>
) => {
  const createNotification = async (
    notificationEntity: CreateNotificationEntityType
  ) => await respository.createNotification(notificationEntity);

  return {createNotification};
};

export type NotificationInterface = typeof notificationRepository;

export type NotificationRepository = ReturnType<typeof notificationRepository>;
