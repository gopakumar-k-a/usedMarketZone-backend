import { BidHistory } from "../models/bidHistoryModel";
import { IBidHistory } from "../models/bidHistoryModel";
import { CreateBidHistoryEntityType } from "../../../../entities/bidding/createBidHistory";
import mongoose from "mongoose";
export const bidHistoryRepositoryMongoDb = () => {
  const createNewBidHistory = async (
    createBidHistoryEntity: CreateBidHistoryEntityType
  ): Promise<IBidHistory | null> => {

    const newBidHistory = await BidHistory.create({
      bidderId: createBidHistoryEntity.getBidderId(),
      bidAmount: createBidHistoryEntity.getBidAmount(),
      bidTime: createBidHistoryEntity.getBidTime(),
      bidData: createBidHistoryEntity.getBidData(),
      productId: createBidHistoryEntity.getProductId(),
    });

    console.log("newBidHistory ", newBidHistory);

    return newBidHistory;
  };

  const getHighestBid = async (bidIds: mongoose.Types.ObjectId[]) => {
    const highestBidDetails = await BidHistory.aggregate([
      { $match: { _id: { $in: bidIds } } },
      { $sort: { bidAmount: -1 } },
      { $limit: 1 },
    ]).exec();
    return highestBidDetails.length > 0 ? highestBidDetails[0] : null;
  };

  return {
    createNewBidHistory,
    getHighestBid,
  };
};

export type BidHistoryRepositoryMongoDb = typeof bidHistoryRepositoryMongoDb;
