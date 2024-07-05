import { Conversation } from "../models/conversationModel";
import { CreateConversationEntityType } from "../../../../entities/createConversationEntity";
import mongoose from "mongoose";
const {ObjectId}=mongoose.Types
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

  const getMessages = async (sendId: string, userToChatId: string) => {

    console.log('sendId userToChatId',sendId,' ',userToChatId);
    
    const chats = await Conversation.aggregate([
      {
        $match: {
          participants: {
            $all: [new ObjectId(sendId) , new ObjectId(userToChatId)],
          },
        },
      },
      {
        $lookup:{
            from:'messages',
            localField:'messages',
            foreignField:'_id',
            as:'chat'
        }
      },
      {$unwind:'$chat'},
      {$project:{
        'chat.message':1,
        'chat.senderId':1,
        'chat.recieverId':1,
        'chat.createdAt':1
      },},{
        $sort:{
            createdAt:1
        }
      }
    ]);

    console.log('chats ',chats);
    return chats
    
  };
  return {
    createConversation,
    getMessages,
  };
};

export type ConversationRepositoryMongoDb =
  typeof conversationRepositoryMongoDb;
