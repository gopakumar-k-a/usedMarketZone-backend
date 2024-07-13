import { Messages } from "../models/messageModel";
import { CreateMessageEntityType } from "../../../../entities/createMessageEntity";
import { CreatePostEntityType } from "../../../../entities/createSendPostEntity";
import { CreatePostReplyMessageEntityType } from "../../../../entities/createPostReplyMessageEntity";
export const messageRepositoryMongoDb = () => {
  const sendNewMessage = async (messageEntity: CreateMessageEntityType) => {
    const newMessage = new Messages({
      senderId: messageEntity.getSenderId(),
      recieverId: messageEntity.getRecieverId(),
      message: messageEntity.getMessage(),
    });

    await newMessage.save();

    return newMessage;
  };
  const sendPostAsMessage = async (sendPostEntity: CreatePostEntityType) => {
    const newMessage = new Messages({
      senderId: sendPostEntity.getSenderId(),
      recieverId: sendPostEntity.getRecieverId(),
      postId: sendPostEntity.getPostId(),
      isPost: true,
    });

    await newMessage.save();

    return newMessage;
  };

  const sendPostReplyAsMessage = async (
    sendPostReplyEntity: CreatePostReplyMessageEntityType
  ) => {
    const newPostReplyMessage = new Messages({
      senderId: sendPostReplyEntity.getSenderId(),
      recieverId: sendPostReplyEntity.getRecieverId(),
      message: sendPostReplyEntity.getMessage(),
      postId: sendPostReplyEntity.getPostId(),
      isPostReply: true,
    });

    await newPostReplyMessage.save();

    return newPostReplyMessage;
  };

  return {
    sendNewMessage,
    sendPostAsMessage,
    sendPostReplyAsMessage,
  };
};

export type MessageRepositoryMongoDb = typeof messageRepositoryMongoDb;
