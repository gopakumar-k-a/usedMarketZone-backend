import { BidHistory } from "../models/bidHistoryModel";
import { IBidHistory } from "../models/bidHistoryModel";
import { CreateBidHistoryEntityType } from "../../../../entities/bidding/createBidHistory";
import mongoose, { Types } from "mongoose";
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

  const getUserPreviousBidsSumOnProduct = async (
    bidderId: Types.ObjectId,
    bidProductId: Types.ObjectId
  ) => {
    console.log(`getUserPreviousBidsSum
          userId:${bidderId},
    bidProductId: ${bidProductId} `);

    interface PreviousBidSumOfUser {
      _id: Types.ObjectId;
      previousBidSumOfBidder: number;
    }
    const previousBidSumOfUser: PreviousBidSumOfUser[] =
      await BidHistory.aggregate<PreviousBidSumOfUser>([
        {
          $match: {
            productId: bidProductId,
            bidderId: bidderId,
          },
        },
        {
          $group: {
            _id: "$bidderId",
            previousBidSumOfBidder: { $sum: "$bidAmount" },
            bidDetails: { $push: "$$ROOT" }, // Optionally include bid details
          },
        },
        {
          $project: {
            previousBidSumOfBidder: 1,
          },
        },
      ]);

    return previousBidSumOfUser;
  };

  return {
    createNewBidHistory,
    getHighestBid,
    getUserPreviousBidsSumOnProduct,
  };
};

export type BidHistoryRepositoryMongoDb = typeof bidHistoryRepositoryMongoDb;
