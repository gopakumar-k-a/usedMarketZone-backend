import Notification from "../models/notificationModel";
import { CreateNotificationEntityType } from "../../../../entities/createNotificationEntity";
import AppError from "../../../../utils/appError";
import { HttpStatusCodes } from "../../../../types/httpStatusCodes";
import { NotificationFromDb } from "../../../../types/notification";

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
      })

      const populatedNotification= await Notification.findById(newNotification._id)
      .populate({
        path: 'senderId',
        select: 'userName imageUrl',
      })
      .populate({
        path: 'postId',
        select: 'productImageUrls',
      })
      .populate({
        path:'messageId',
        select:'messages'
      })
      .exec();
    // const populatedNotification = await Notification.aggregate([
    //     {
    //       $match: { _id: newNotification._id },
    //     },
    //     {
    //       $lookup: {
    //         from: 'users',
    //         localField: 'senderId',
    //         foreignField: '_id',
    //         as: 'senderDetails',
    //       },
    //     },
    //     {
    //       $unwind: '$senderDetails',
    //     },
    //     {
    //       $lookup: {
    //         from: 'posts',
    //         localField: 'postId',
    //         foreignField: '_id',
    //         as: 'postDetails',
    //       },
    //     },
    //     {
    //       $unwind: {
    //         path: '$postDetails',
    //         preserveNullAndEmptyArrays: true,
    //       },
    //     },
    //     {
    //       $lookup: {
    //         from: 'messages',
    //         localField: 'messageId',
    //         foreignField: '_id',
    //         as: 'messageDetails',
    //       },
    //     },
    //     {
    //       $unwind: '$messageDetails',
    //     },
    //     {
    //       $project: {
    //         notificationType: 1,
    //         status: 1,
    //         additionalInfo: 1,
    //         priority: 1,
    //         createdAt: 1,
    //         updatedAt: 1,
    //         'senderDetails.userName': 1,
    //         'senderDetails.imageUrl': 1,
    //         'postDetails.productImageUrls': 1,
    //         'messageDetails.messages': 1,
    //       },
    //     },
    //   ]).exec();

      console.log(populatedNotification,'populatedNotification')
      return populatedNotification;
    } catch (error) {
      console.error("Error creating notification:", error);
      throw new AppError(
        "faliled To CreateNotification",
        HttpStatusCodes.BAD_GATEWAY
      ); // Rethrow the error to be handled by the caller
    }
  };

  return { createNotification };
};

export type NotificationRepositoryMongoDB =
  typeof notificationRepositoryMongoDB;
