import { Types } from "mongoose";
export const createSendPostEntity = (
  senderId: string,
  recieverId: string,
  postId: string
) => {
  return {
    getSenderId: (): Types.ObjectId => new Types.ObjectId(senderId),
    getRecieverId: (): Types.ObjectId => new Types.ObjectId(recieverId),
    getPostId: (): Types.ObjectId => new Types.ObjectId(postId),
  };
};

export type CreatePostEntityType = ReturnType<typeof createSendPostEntity>;
