import { Types } from "mongoose";
import { AdminBidRequestDbInterface } from "../../repositories/adminBidRequestDbRepository";
import { BidHistoryRepository } from "../../repositories/bidHistoryRepository";
export const handleGetBidRequests = async (
  adminBidRequestDb: ReturnType<AdminBidRequestDbInterface>
) => {
  const bidRequests = await adminBidRequestDb.getBidRequestsFromDb();

  return bidRequests;
};

export const handleGetBidDetailsOfUserOnProduct = async (
  userId: string,
  bidProductId: string,
  bidHistoryDb: BidHistoryRepository
) => {
  const bidHistory = await bidHistoryDb.getUserBidHistoryOnProduct(
    new Types.ObjectId(userId),
    new Types.ObjectId(bidProductId)
  );

  return bidHistory;
};


export const handleAdminGetBidHistoryOfProduct=async(productId:string,  bidHistoryDb: BidHistoryRepository)=>{


    const bidHistory=await bidHistoryDb.getProductBidHistoryAdmin(new Types.ObjectId(productId))

    return bidHistory
}
