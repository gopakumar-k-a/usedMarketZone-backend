import { ObjectId } from 'mongoose';

export enum NotificationType {
  COMMENT = "comment",
  BID = "bid",
  MESSAGE = "message",
}

export interface NotificationFromDb {
  _id: ObjectId;
  notificationType: NotificationType;
  messageId: {
    _id: ObjectId;
  };
  senderId: {
    _id: ObjectId;
    userName: string;
    imageUrl: string;
  };
  receiverId: ObjectId;
  status: string;
  additionalInfo: string;
  priority: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}
