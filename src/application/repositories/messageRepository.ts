
import { MessageRepositoryMongoDb } from "../../frameworks/database/mongodb/repositories/messageRepositoryMongoDb"
import { CreateMessageEntityType } from "../../entities/createMessageEntity"
export const messageRepository=(repository:ReturnType<MessageRepositoryMongoDb>)=>{
    const sendNewMessage=async(messageEntity:CreateMessageEntityType)=>await repository.sendNewMessage(messageEntity)

    return {
        sendNewMessage
    }

}

export type MessageDbRepository=ReturnType<typeof messageRepository>
export type MessageRepositoryInterface=typeof messageRepository
