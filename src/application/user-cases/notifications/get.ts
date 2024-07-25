import { NotificationRepository } from "../../repositories/notificationRepository";

export const handleGetUserNotifications = async (
  userId: string,
  notificationDb: NotificationRepository
) => {
  const notifications = await notificationDb.getNotifications(userId);

  console.log('notifications ',notifications);
  return notifications;
};
