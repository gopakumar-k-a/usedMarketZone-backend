import { Conversation } from "../models/conversationModel";
import { CreateConversationEntityType } from "../../../../entities/createConversationEntity";
import mongoose from "mongoose";
const { ObjectId } = mongoose.Types;
export const conversationRepositoryMongoDb = () => {
  const createConversation = async (
    conversationEntity: CreateConversationEntityType
  ) => {
    const conversation = await Conversation.findOne({
      participants: {
        $all: [
          conversationEntity.getSenderId(),
          conversationEntity.getRecieverId(),
        ],
      },
    });

    if (!conversation) {
      await Conversation.create({
        participants: [
          conversationEntity.getSenderId(),
          conversationEntity.getRecieverId(),
        ],
        messages: [conversationEntity.getMessageId()],
      });
    } else {
      conversation.messages.push(conversationEntity.getMessageId());
      await conversation.save();
    }
  };

  const getMessages = async (recieverId: string, userToChatId: string) => {
    console.log("sendId userToChatId", recieverId, " ", userToChatId);

    const chats = await Conversation.aggregate([
      {
        $match: {
          participants: {
            $all: [new ObjectId(recieverId), new ObjectId(userToChatId)],
          },
        },
      },
      {
        $lookup: {
          from: "messages",
          localField: "messages",
          foreignField: "_id",
          as: "chat",
        },
      },
      { $unwind: "$chat" },
      {
        $lookup: {
          from: "products",
          localField: "chat.postId",
          foreignField: "_id",
          as: "post",
        },
      },
      {
        $unwind: { path: "$post", preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: "users",
          localField: "post.userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: { path: "$user", preserveNullAndEmptyArrays: true },
      },
      {
        $project: {
          _id: 0,
          message: "$chat.message",
          senderId: "$chat.senderId",
          recieverId: "$chat.recieverId",
          createdAt: "$chat.createdAt",
          isPost: "$chat.isPost",
          postId: "$post._id",
          postImageUrl: "$post.productImageUrls",
          postDescription:"$post.description",
          postIsBidding:"$post.isBidding",
          postCreatedAt:"$post.createdAt",
          postOwnerId:"$user._id",
          postOwnerUserName:"$user.userName",
          isPostReply:'$chat.isPostReply'
        },
      },
      {
        $sort: {
          createdAt: 1,
        },
      },
    ]);

    console.log("chats ", chats);
    return chats;
  };
  return {
    createConversation,
    getMessages,
  };
};

export type ConversationRepositoryMongoDb =
  typeof conversationRepositoryMongoDb;
