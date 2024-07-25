
import { MessageRepositoryMongoDb } from "../../frameworks/database/mongodb/repositories/messageRepositoryMongoDb"
import { CreateMessageEntityType } from "../../entities/createMessageEntity"
import { CreatePostEntityType } from "../../entities/createSendPostEntity"
import { CreatePostReplyMessageEntityType } from "../../entities/createPostReplyMessageEntity"
import { Types } from "mongoose"
export const messageRepository=(repository:ReturnType<MessageRepositoryMongoDb>)=>{
    const sendNewMessage=async(messageEntity:CreateMessageEntityType)=>await repository.sendNewMessage(messageEntity)
    const sendPostAsMessage = async (sendPostEntity: CreatePostEntityType) =>await repository.sendPostAsMessage(sendPostEntity)
    const sendPostReplyAsMessage = async (
        sendPostReplyEntity: CreatePostReplyMessageEntityType
      ) =>await repository.sendPostReplyAsMessage(sendPostReplyEntity)

      const getUnseenMessagesCount = async (
        senderId: Types.ObjectId,
        receiverId: Types.ObjectId
      ) => await repository.getUnseenMessagesCount(senderId,receiverId)

      const changeUnseenStatusConversationWise = async (
        senderId: Types.ObjectId,
        recieverId: Types.ObjectId
      ) =>await repository.changeUnseenStatusConversationWise(senderId,recieverId)
    return {
        sendNewMessage,
        sendPostAsMessage,
        sendPostReplyAsMessage,
        getUnseenMessagesCount,
        changeUnseenStatusConversationWise
    }

}

export type MessageDbRepository=ReturnType<typeof messageRepository>
export type MessageRepositoryInterface=typeof messageRepository
