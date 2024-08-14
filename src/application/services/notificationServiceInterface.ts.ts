
import { NotificationService } from "../../frameworks/services/notificationService";

export const notificationServiceInterface = (
  service: ReturnType<NotificationService>
) => {
  const sendRealTimeNotification = (
    recieverId: string,
    notificationType: string,
    newNotification: any, 
    additionalInfo?: any
  ) =>
    service.sendRealTimeNotification(
      recieverId,
      notificationType,
      newNotification,
      additionalInfo
    );

  return {
    sendRealTimeNotification,
  };
};

export type NotificationServiceInterface = typeof notificationServiceInterface;
