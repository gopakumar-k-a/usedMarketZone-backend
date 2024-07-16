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
  //if cant find bid on data base throw error
  if (!bid) {
    throw new AppError("Bid not found", HttpStatusCodes.BAD_GATEWAY);
  }

  //owner of the bid is not allowed to place bid on their bid products
  if (bidderId == String(bid.userId)) {
    throw new AppError(
      "Owner of the Bid is Not Allowed To Bid On Their Products",
      HttpStatusCodes.BAD_REQUEST
    );
  }

  //function to check weather bid ended or not
  const isBidEnded = (endTime: Date) => {
    const currentTime = new Date().getTime();

    const bidEndTime = endTime.getTime();

    return currentTime < bidEndTime;
  };

  //if bid is ended throw new error
  if (isBidEnded(bid.bidEndTime)) {
    throw new AppError(
      "Cant Bid The bid Have Ended ",
      HttpStatusCodes.BAD_REQUEST
    );
  }
  console.log("bid is ", bid);

  const currentDate = new Date(Date.now());

  //if bid history.length==0 means no one has bidded on the product so create new bid history entity
  const currentHighestBid = bid.currentHighestBid;
  let totalBidAmount = parseInt(bidAmount);
  const bidderPreviousBidSumOnProduct =
    await bidHistoryRepositoryDb.getUserPreviousBidsSumOnProduct(
      new mongoose.Types.ObjectId(bidderId),
      new mongoose.Types.ObjectId(bidProductId)
    );

  console.log("bidderPreviousBidSumOnProduct ", bidderPreviousBidSumOnProduct);
  // console.log('bidderPreviousBidSumOnProduct[0].previousBidSumOfUser ',bidderPreviousBidSumOnProduct[0].previousBidSumOfBidder);

  bidderPreviousBidSumOnProduct.length > 0
    ? (totalBidAmount +=
        bidderPreviousBidSumOnProduct[0].previousBidSumOfBidder)
    : (totalBidAmount = totalBidAmount);
  console.log(`bidAmount ${bidAmount} 
  totalBidAmount ${totalBidAmount}
  i`);

  if (bid.bidHistory.length === 0) {
    //check if the bid amount is greater than the base bidPrice

    if (bid.baseBidPrice >= totalBidAmount) {
      throw new AppError(
        "Bid Amount Must be greater that Base Bid Price ",
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

    console.log("newBidHistoryEntity ", newBidHistoryEntity);
    const newBidHistory = (await bidHistoryRepositoryDb.createNewBidHistory(
      newBidHistoryEntity
    )) as IBidHistory;

    // bid.currentHighestBid = parseInt(bidAmount);
    // bid.highestBidderId = new mongoose.Types.ObjectId(bidderId);

    // if (newBidHistory) {
    // bid.highestBidderHistoryId = new mongoose.Types.ObjectId(
    //   newBidHistory?._id as string
    // );
    // bid.bidHistory.push(
    //   new mongoose.Types.ObjectId(newBidHistory?._id as string)
    // );

    //add current highest bid, highest bidder id push bid history id to bid
    //set "highestBidderHistoryId" as bid history id

    // bidHistoryId: Types.ObjectId,
    // bidId: Types.ObjectId,
    // currentHighestBid:number,
    // highestBidderId:Types.ObjectId,
    const UpdatedBid = await bidRepositoryDb.placeBid(
      new mongoose.Types.ObjectId(newBidHistory?._id as string),
      bid._id,
      totalBidAmount,
      (bid.highestBidderId = new mongoose.Types.ObjectId(bidderId))
    );
    // }

    // await bidRepositoryDb.updateBid(bid._id.toString(), bid);

    // return newBidHistory;

    return totalBidAmount;
  } else {
    // const currentHighestBid = bid.currentHighestBid;
    // let amountToBid=bidAmount
    // const bidderPreviousBidSumOnProduct=await bidHistoryRepositoryDb.getUserPreviousBidsSumOnProduct(
    //   new mongoose.Types.ObjectId(bidderId),
    //   new mongoose.Types.ObjectId(bidProductId)
    // )

    // console.log('bidderPreviousBidSumOnProduct ',bidderPreviousBidSumOnProduct);
    // bidderPreviousBidSumOnProduct.length>0?amountToBid+=bidderPreviousBidSumOnProduct[0].previousBidSumOfUser:amountToBid=amountToBid

    //already have a bid history entity so check weather the bid amount is greater than the current highest bid
    // if not throw error
    if (totalBidAmount <= currentHighestBid) {
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

    //create new document in bidhistory collection

    const newBidHistory = await bidHistoryRepositoryDb.createNewBidHistory(
      newBidHistoryEntity
    );

    // //add current highest bid amount on the bid document
    // bid.currentHighestBid = parseInt(bidAmount);
    // //add current highest bidder id to bid document
    // bid.highestBidderId = new mongoose.Types.ObjectId(bidderId);

    // //push bid history document id to bid document
    // if (newBidHistory) {
    //   bid.highestBidderHistoryId = new mongoose.Types.ObjectId(
    //     newBidHistory?._id as string
    //   );
    //   bid.bidHistory.push(
    //     new mongoose.Types.ObjectId(newBidHistory?._id as string)
    //   );
    // }
    // //update the current bid history document
    // await bidRepositoryDb.updateBid(bid._id.toString(), bid);

    const UpdatedBid = await bidRepositoryDb.placeBid(
      new mongoose.Types.ObjectId(newBidHistory?._id as string),
      // newBidHistory._id,
      bid._id,
      totalBidAmount,
      (bid.highestBidderId = new mongoose.Types.ObjectId(bidderId))
    );

    return totalBidAmount;
  }
};
