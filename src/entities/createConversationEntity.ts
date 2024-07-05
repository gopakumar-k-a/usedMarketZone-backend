import { Types } from "mongoose";

export const createConversationEntity = (
  senderId: string,
  recieverId: string,
  messageId: Types.ObjectId
) => {
  return {
    getSenderId: (): Types.ObjectId => new Types.ObjectId(senderId),
    getRecieverId: (): Types.ObjectId => new Types.ObjectId(recieverId),
    getMessageId:  (): Types.ObjectId =>messageId,
  };
};

export type CreateConversationEntityType = ReturnType<
  typeof createConversationEntity
>;
