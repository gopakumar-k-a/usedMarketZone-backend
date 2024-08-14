import { Types } from "mongoose";

export const createNotificationEntity = (
  notificationType:
    | "comment"
    | "outBid"
    | "bidWin"
    | "bidLose"
    | "message"
    | "follow",
  senderId: string | null,
  receiverId: string,
  status: "read" | "unread" = "unread",
  postId?: string,
  messageId?: string,
  bidId?: string,
  additionalInfo?: string,
  priority: "low" | "medium" | "high" = "medium",
  messageType?: "post" | "normal" 
) => {
  return {
    getNotificationType: ():
      | "comment"
      | "outBid"
      | "bidWin"
      | "bidLose"
      | "message"
      | "follow" => notificationType,
    getSenderId: (): Types.ObjectId | null =>
      senderId ? new Types.ObjectId(senderId) : null,
    getReceiverId: (): Types.ObjectId => new Types.ObjectId(receiverId),
    getStatus: (): "read" | "unread" => status,
    getPostId: (): Types.ObjectId | undefined =>
      postId ? new Types.ObjectId(postId) : undefined,
    getMessageId: (): Types.ObjectId | undefined =>
      messageId ? new Types.ObjectId(messageId) : undefined,
    getBidId: (): Types.ObjectId | undefined =>
      bidId ? new Types.ObjectId(bidId) : undefined,
    getAdditionalInfo: (): string | undefined => additionalInfo,
    getPriority: (): "low" | "medium" | "high" => priority,
    getMessageType: (): "post" | "normal" | undefined => messageType,
  };
};

export type CreateNotificationEntityType = ReturnType<
  typeof createNotificationEntity
>;
