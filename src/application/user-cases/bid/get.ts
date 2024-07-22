import { Types } from "mongoose";
import { AdminBidRequestDbInterface } from "../../repositories/adminBidRequestDbRepository";
import { BidHistoryRepository } from "../../repositories/bidHistoryRepository";
import { ProductDbInterface } from "../../repositories/productDbRepository";
export const handleGetBidRequests = async (
  adminBidRequestDb: ReturnType<AdminBidRequestDbInterface>
) => {
  const bidRequests = await adminBidRequestDb.getBidRequestsFromDb();

  return bidRequests;
};

export const handleGetUserWiseBidRequests = async (
  userId: string,
  adminBidRequestDb: ReturnType<AdminBidRequestDbInterface>,
  productDb:ReturnType<ProductDbInterface>
  
) => {
  // const userWiseBidRequests = await adminBidRequestDb.getUserWiseBidRequests(
  //   new Types.ObjectId(userId)
  // );

  const userWiseBidRequests=await productDb.getUserBids(new Types.ObjectId(userId))

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
