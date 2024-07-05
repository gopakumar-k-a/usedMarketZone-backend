
import { Messages } from "../models/messageModel"
import { CreateMessageEntityType } from "../../../../entities/createMessageEntity"
export const messageRepositoryMongoDb=()=>{
    const sendNewMessage=async(messageEntity:CreateMessageEntityType)=>{



        const newMessage=new Messages({
            senderId:messageEntity.getSenderId(),
            recieverId:messageEntity.getRecieverId(),
            message:messageEntity.getMessage()
        })

        await newMessage.save()

        return newMessage

    }

    return {
        sendNewMessage
    }
}

export type MessageRepositoryMongoDb=typeof messageRepositoryMongoDb