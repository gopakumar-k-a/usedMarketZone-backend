import { Types } from "mongoose";
import { BidRepository } from "../../application/repositories/bidRepository";


export const bidService=()=>{



 const processBidClosure = async (bidRepository: BidRepository , bidId: Types.ObjectId): Promise<void> => {

  
  }

  return {
    processBidClosure
  }
}


  export type BidService=typeof bidService