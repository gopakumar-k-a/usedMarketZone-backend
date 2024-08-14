import { Messages } from "../models/messageModel";
import { CreateMessageEntityType } from "../../../../entities/createMessageEntity";
import { CreatePostEntityType } from "../../../../entities/createSendPostEntity";
import { CreatePostReplyMessageEntityType } from "../../../../entities/createPostReplyMessageEntity";
import { Types } from "mongoose";
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

  const getUnseenMessagesCount = async (
    senderId: Types.ObjectId,
    recieverId: Types.ObjectId
  ) => {
    const unseenMessagesCount = await Messages.aggregate([
      {
        $match: {
          senderId: senderId,
          recieverId: recieverId,
          isSeen: false,
        },
      },
      {
        $group: {
          _id: null,
          unseenCount: {
            $sum: 1,
          },
        },
      },
    ]);

    return unseenMessagesCount.length > 0
      ? unseenMessagesCount[0].unseenCount
      : 0;
  };

  const changeUnseenStatusConversationWise = async (
    senderId: Types.ObjectId,
    recieverId: Types.ObjectId
  ) => {
    const updateResult = await Messages.updateMany(
      {
        senderId: senderId,
        recieverId: recieverId,
        isSeen: false,
      },
      { $set: { isSeen: true } }
    );

    return;
  };
  return {
    sendNewMessage,
    sendPostAsMessage,
    sendPostReplyAsMessage,
    getUnseenMessagesCount,
    changeUnseenStatusConversationWise,
  };
};

export type MessageRepositoryMongoDb = typeof messageRepositoryMongoDb;
