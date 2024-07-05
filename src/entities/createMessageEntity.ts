
import {Types} from "mongoose"
export const createMessageEntity=(
    senderId:string,
    recieverId:string,
    message:string
)=>{

  return {
    getSenderId:():Types.ObjectId=>new Types.ObjectId(senderId),
    getRecieverId:():Types.ObjectId=>new Types.ObjectId(recieverId),
    getMessage:():string=>message
  };


}



export type CreateMessageEntityType=ReturnType<typeof createMessageEntity>

