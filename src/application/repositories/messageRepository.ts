
import { MessageRepositoryMongoDb } from "../../frameworks/database/mongodb/repositories/messageRepositoryMongoDb"
import { CreateMessageEntityType } from "../../entities/createMessageEntity"
import { CreatePostEntityType } from "../../entities/createSendPostEntity"
import { CreatePostReplyMessageEntityType } from "../../entities/createPostReplyMessageEntity"
export const messageRepository=(repository:ReturnType<MessageRepositoryMongoDb>)=>{
    const sendNewMessage=async(messageEntity:CreateMessageEntityType)=>await repository.sendNewMessage(messageEntity)
    const sendPostAsMessage = async (sendPostEntity: CreatePostEntityType) =>await repository.sendPostAsMessage(sendPostEntity)
    const sendPostReplyAsMessage = async (
        sendPostReplyEntity: CreatePostReplyMessageEntityType
      ) =>await repository.sendPostReplyAsMessage(sendPostReplyEntity)
    return {
        sendNewMessage,
        sendPostAsMessage,
        sendPostReplyAsMessage
    }

}

export type MessageDbRepository=ReturnType<typeof messageRepository>
export type MessageRepositoryInterface=typeof messageRepository
