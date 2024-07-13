import { BidRepository } from "../../repositories/bidRepository";
import {
  BidHistoryRepository,
  bidHistoryRepository,
} from "../../repositories/bidHistoryRepository";
import { createBidHistoryEntity } from "../../../entities/bidding/createBidHistory";
import { CreateBidHistoryEntityType } from "../../../entities/bidding/createBidHistory";
import AppError from "../../../utils/appError";
import { HttpStatusCodes } from "../../../types/httpStatusCodes";
import mongoose from "mongoose";
import { IBid } from "../../../frameworks/database/mongodb/models/bidModel";
import { IBidHistory } from "../../../frameworks/database/mongodb/models/bidHistoryModel";
export const handlePlaceBid = async (
  bidderId: string,
  bidProductId: string,
  bidAmount: string,
  bidRepositoryDb: BidRepository,
  bidHistoryRepositoryDb: BidHistoryRepository
) => {
  console.log(
    `  bidderId: string,
  bidProductId: string,
  bidAmount: string,`,
    bidderId,
    bidProductId,
    bidAmount
  );

  const bid = await bidRepositoryDb.getBidDetails(bidProductId);

  if (!bid) {
    throw new AppError("Bid not found", HttpStatusCodes.BAD_GATEWAY);
  }

  if (bid.baseBidPrice >= parseInt(bidAmount)) {
    throw new AppError(
      "Bid Amount Must be greater that Base Bid Price ",
      HttpStatusCodes.BAD_REQUEST
    );
  }
  const isBidEnded = (endTime: Date) => {
    const currentTime = new Date().getTime();

    const bidEndTime = endTime.getTime();

    return currentTime < bidEndTime;
  };

  if (isBidEnded(bid.bidEndTime)) {
    throw new AppError(
      "Cant Bid The bid Have Ended ",
      HttpStatusCodes.BAD_REQUEST
    );
  }
  console.log("bid is ", bid);

  const currentDate = new Date(Date.now());
  if (bid.bidHistory.length === 0) {
    const newBidHistoryEntity: CreateBidHistoryEntityType =
      createBidHistoryEntity(
        bidderId,
        String(bid._id),
        bidProductId,
        bidAmount,
        currentDate
      );

    console.log("newBidHistoryEntity ", newBidHistoryEntity);
    const newBidHistory = (await bidHistoryRepositoryDb.createNewBidHistory(
      newBidHistoryEntity
    )) as IBidHistory;

    bid.currentHighestBid = parseInt(bidAmount);
    bid.highestBidderId = new mongoose.Types.ObjectId(bidderId);

    if (newBidHistory) {
      bid.highestBidderHistoryId = new mongoose.Types.ObjectId(
        newBidHistory?._id as string
      );
      bid.bidHistory.push(
        new mongoose.Types.ObjectId(newBidHistory?._id as string)
      );
    }

    await bidRepositoryDb.updateBid(bid._id.toString(), bid);

    return newBidHistory;
  } else {
    const currentHighestBid = bid.currentHighestBid;

    if (parseInt(bidAmount) <= currentHighestBid) {
      throw new AppError(
        "Your bid must be higher than the current highest bid.",
        HttpStatusCodes.BAD_REQUEST
      );
    }
    const newBidHistoryEntity: CreateBidHistoryEntityType =
      createBidHistoryEntity(
        bidderId,
        String(bid._id),
        bidProductId,
        bidAmount,
        currentDate
      );
    const newBidHistory = await bidHistoryRepositoryDb.createNewBidHistory(
      newBidHistoryEntity
    );

    bid.currentHighestBid = parseInt(bidAmount);
    bid.highestBidderId = new mongoose.Types.ObjectId(bidderId);

    if (newBidHistory) {
      bid.highestBidderHistoryId = new mongoose.Types.ObjectId(
        newBidHistory?._id as string
      );
      bid.bidHistory.push(
        new mongoose.Types.ObjectId(newBidHistory?._id as string)
      );
    }

    await bidRepositoryDb.updateBid(bid._id.toString(), bid);

    return;
  }
};
