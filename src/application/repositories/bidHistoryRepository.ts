import { Types } from "mongoose";
import { CreateBidHistoryEntityType } from "../../entities/bidding/createBidHistory";
import { IBidHistory } from "../../frameworks/database/mongodb/models/bidHistoryModel";
import { BidHistoryRepositoryMongoDb } from "../../frameworks/database/mongodb/repositories/bidHistoryRepositoryMongoDb";

export const bidHistoryRepository = (
  repository: ReturnType<BidHistoryRepositoryMongoDb>
) => {
  const createNewBidHistory = async (
    createBidHistoryEntity: CreateBidHistoryEntityType
  ):Promise<IBidHistory|null> => await repository.createNewBidHistory(createBidHistoryEntity);
  const getUserPreviousBidsSumOnProduct = async (
    userId: Types.ObjectId,
    bidProductId: Types.ObjectId
  ) =>repository.getUserPreviousBidsSumOnProduct(userId,bidProductId)


  return {
    createNewBidHistory,
    getUserPreviousBidsSumOnProduct
  };
};

export type BidHistoryRepository = ReturnType<typeof bidHistoryRepository>;

export type BidHistoryInterface = typeof bidHistoryRepository;
