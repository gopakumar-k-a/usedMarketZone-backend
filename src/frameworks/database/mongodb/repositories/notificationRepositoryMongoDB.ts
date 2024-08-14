import Notification from "../models/notificationModel";
import { CreateNotificationEntityType } from "../../../../entities/createNotificationEntity";
import AppError from "../../../../utils/appError";
import { HttpStatusCodes } from "../../../../types/httpStatusCodes";

export const notificationRepositoryMongoDB = () => {
  const createNotification = async (
    notificationEntity: CreateNotificationEntityType
  ) => {
    try {
      const newNotification = await Notification.create({
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

      const populatedNotification = await Notification.findById(
        newNotification._id
      )
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
    } catch (error) {
      throw new AppError(
        "faliled To CreateNotification",
        HttpStatusCodes.BAD_GATEWAY
      );
    }
  };

  const getNotifications = async (userId: string) => {
    const notifications = await Notification.find({ receiverId: userId })
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

  const removeFollowNotification = async (
    senderId: string,
    receiverId: string
  ) => {
    await Notification.findOneAndDelete({
      senderId: senderId,
      receiverId: receiverId,
      notificationType: "follow",
    });

    return;
  };

  const changeUnreadStatusNotification = async (receiverId: string) => {
    await Notification.updateMany(
      { receiverId, status: "unread" },
      { status: "read" }
    );
    return;
  };
  return {
    createNotification,
    getNotifications,
    removeFollowNotification,
    changeUnreadStatusNotification,
  };
};

export type NotificationRepositoryMongoDB =
  typeof notificationRepositoryMongoDB;
