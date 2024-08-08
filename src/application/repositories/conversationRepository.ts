import { Types } from "mongoose"
import { CreateConversationEntityType } from "../../entities/createConversationEntity"
import { ConversationRepositoryMongoDb } from "../../frameworks/database/mongodb/repositories/conversationRepositoryMongoDb"

export const conversationRepository=(repository:ReturnType<ConversationRepositoryMongoDb>)=>{
  const createConversation = async (
    conversationEntity: CreateConversationEntityType
  ) =>await repository.createConversation(conversationEntity)
  const getMessages = async (recieverId: string, userToChatId: string) =>repository.getMessages(recieverId,userToChatId)
  const getConversationsWithUserData = async (userId: Types.ObjectId) =>await repository.getConversationsWithUserData(userId) 

      return{
        createConversation,
        getMessages,
        getConversationsWithUserData
      }

}

export type ConversationDbRepository=ReturnType<typeof conversationRepository>

export type ConversationInterface=typeof conversationRepository