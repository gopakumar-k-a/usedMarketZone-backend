import { Types } from "mongoose";
import { AdminBidRequestDbInterface } from "../../repositories/adminBidRequestDbRepository";
import {
  BidHistoryInterface,
  BidHistoryRepository,
} from "../../repositories/bidHistoryRepository";
import { ProductDbInterface } from "../../repositories/productDbRepository";
import { BidInterface } from "../../repositories/bidRepository";
export const handleGetBidRequests = async (
  adminBidRequestDb: ReturnType<AdminBidRequestDbInterface>
) => {
  const bidRequests = await adminBidRequestDb.getBidRequestsFromDb();

  return bidRequests;
};

export const handleGetUserWiseBidRequests = async (
  userId: string,
  adminBidRequestDb: ReturnType<AdminBidRequestDbInterface>,
  productDb: ReturnType<ProductDbInterface>
) => {
  // const userWiseBidRequests = await adminBidRequestDb.getUserWiseBidRequests(
  //   new Types.ObjectId(userId)
  // );

  const userWiseBidRequests = await productDb.getUserBids(
    new Types.ObjectId(userId)
  );

  return userWiseBidRequests;
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

export const handleAdminGetBidHistoryOfProduct = async (
  productId: string,
  bidHistoryDb: BidHistoryRepository
) => {
  const bidHistory = await bidHistoryDb.getProductBidHistoryAdmin(
    new Types.ObjectId(productId)
  );

  return bidHistory;
};

export const handleGetMyParticipatingBids = async (
  userId: string,
  bidHistoryDb: BidHistoryRepository
) => {
  const myParticipatingBids = await bidHistoryDb.getUserParticipatingBids(
    new Types.ObjectId(userId)
  );

  return myParticipatingBids;
};

export const handleGetClaimProductDetails = async (
  userId: string,
  productId: string,
  bidHistoryDb: ReturnType<BidHistoryInterface>
) => {
  console.log('product id ',productId);
  
  const claimableBid = await bidHistoryDb.getClaimableBidDetails(
    new Types.ObjectId(userId),
    new Types.ObjectId(productId)
  );
console.log('claim bid details ',claimableBid);

  return claimableBid;
};

export const handleGetBidResultForOwner=async(productId:string,userId:string,bidDb:ReturnType<BidInterface>)=>{


  const result=await bidDb.bidResultsForOwner(new Types.ObjectId(productId),new Types.ObjectId(userId))

  return result
}
