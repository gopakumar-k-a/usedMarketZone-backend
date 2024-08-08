import { Conversation } from "../models/conversationModel";
import { CreateConversationEntityType } from "../../../../entities/createConversationEntity";
import mongoose, { Types } from "mongoose";
const { ObjectId } = mongoose.Types;
export const conversationRepositoryMongoDb = () => {
  const createConversation = async (
    conversationEntity: CreateConversationEntityType
  ) => {
    let conversation = await Conversation.findOne({
      participants: {
        $all: [
          conversationEntity.getSenderId(),
          conversationEntity.getRecieverId(),
        ],
      },
    });

    if (!conversation) {
      conversation = await Conversation.create({
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

    return conversation._id;
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
          postDescription: "$post.description",
          postIsBidding: "$post.isBidding",
          postCreatedAt: "$post.createdAt",
          postOwnerId: "$user._id",
          postOwnerUserName: "$user.userName",
          isPostReply: "$chat.isPostReply",
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

  const getUnreadMessages = async (conversationId: Types.ObjectId) => {
    const unreadMessages = await Conversation.aggregate([
      {
        $match: {
          _id: conversationId,
        },
      },
    ]);
  };

  const getConversationsWithUserData = async (userId: Types.ObjectId) => {
    const conversations = await Conversation.aggregate([
      {
        $match: {
          participants: userId,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "participants",
          foreignField: "_id",
          as: "participantsData",
        },
      },
      {
        $addFields: {
          participantsData: {
            $filter: {
              input: "$participantsData",
              as: "participant",
              cond: { $ne: ["$$participant._id", userId] },
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          createdAt: 1,
          participantsData: {
            userName: 1,
            imageUrl: 1,
            createdAt: 1,
            _id: 1,
          },
        },
      },
    ]).exec();

    console.log("Populated Conversations with User Data: ", conversations);
    console.log("participents data ", conversations[0].participantsData);

    return conversations;

    // const conversations = await Conversation.find({
    //   participants: userId,
    // })
    //   .populate({
    //     path: "participants",
    //     select: "userName imageUrl createdAt _id",
    //   })
    //   .exec();

    // console.log("conversations getConversationsWithUserData", conversations);
    // return conversations;
  };
  return {
    createConversation,
    getMessages,
    getUnreadMessages,
    getConversationsWithUserData,
  };
};

export type ConversationRepositoryMongoDb =
  typeof conversationRepositoryMongoDb;
