import {Types} from "mongoose"

export const createPostReplyMessageEntity=(
    senderId:string,
    recieverId:string,
    productId:string,
    message:string
)=>{

  return {
    getSenderId:():Types.ObjectId=>new Types.ObjectId(senderId),
    getRecieverId:():Types.ObjectId=>new Types.ObjectId(recieverId),
    getPostId:():Types.ObjectId=>new Types.ObjectId(productId),
    getMessage:():string=>message
  };


}



export type CreatePostReplyMessageEntityType=ReturnType<typeof createPostReplyMessageEntity>