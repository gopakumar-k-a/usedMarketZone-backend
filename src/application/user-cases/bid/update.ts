import { BidRepository } from "../../repositories/bidRepository";
import {
  BidHistoryRepository,  
} from "../../repositories/bidHistoryRepository";
import { createBidHistoryEntity } from "../../../entities/bidding/createBidHistory";
import { CreateBidHistoryEntityType } from "../../../entities/bidding/createBidHistory";
import AppError from "../../../utils/appError";
import { HttpStatusCodes } from "../../../types/httpStatusCodes";
import mongoose, { Types } from "mongoose";
import { IBid } from "../../../frameworks/database/mongodb/models/bidModel";
import { IBidHistory } from "../../../frameworks/database/mongodb/models/bidHistoryModel";
import { io } from "../../../app";

export const handlePlaceBid = async (
  bidderId: string,
  bidProductId: string,
  bidAmount: string,
  bidRepositoryDb: BidRepository,
  bidHistoryRepositoryDb: BidHistoryRepository
): Promise<number> => {
  console.log("Placing bid with:", { bidderId, bidProductId, bidAmount });

  const bid = await bidRepositoryDb.getBidDetails(bidProductId);
  if (!bid) {
    throw new AppError("Bid not found", HttpStatusCodes.BAD_GATEWAY);
  }

  if (bidderId === String(bid.userId)) {
    throw new AppError(
      "Owner of the Bid is Not Allowed To Bid On Their Products",
      HttpStatusCodes.BAD_REQUEST
    );
  }

  if (hasBidEnded(bid.bidEndTime)) {
    throw new AppError(
      "Cannot bid, the bid has ended",
      HttpStatusCodes.BAD_REQUEST
    );
  }

  const currentDate = new Date(Date.now());
  const totalBidAmount =await calculateTotalBidAmount(
    bidAmount,
    bidderId,
    bidProductId,
    bidHistoryRepositoryDb
  );

  validateBidAmount(bid, totalBidAmount);

  const newBidHistoryEntity: CreateBidHistoryEntityType =
    createBidHistoryEntity(
      bidderId,
      String(bid._id),
      bidProductId,
      bidAmount,
      currentDate
    );

  const newBidHistory = (await bidHistoryRepositoryDb.createNewBidHistory(
    newBidHistoryEntity
  )) as IBidHistory;

  await updateBidDetails(
    bidRepositoryDb,
    newBidHistory._id as Types.ObjectId,
    bid._id,
    totalBidAmount,
    bidderId
  );

  io.emit("newHighestBid", {
    bidProductId,
    highestBid: totalBidAmount,
  });

  return totalBidAmount;
};

const hasBidEnded = (endTime: Date): boolean => {
  const currentTime = new Date().getTime();
  return currentTime > endTime.getTime();
};

const calculateTotalBidAmount = async (
  bidAmount: string,
  bidderId: string,
  bidProductId: string,
  bidHistoryRepositoryDb: BidHistoryRepository
): Promise<number> => {
  let totalBidAmount = parseInt(bidAmount);
  const previousBidSum =
    await bidHistoryRepositoryDb.getUserPreviousBidsSumOnProduct(
      new mongoose.Types.ObjectId(bidderId),
      new mongoose.Types.ObjectId(bidProductId)
    );

  if (previousBidSum.length > 0) {
    totalBidAmount += previousBidSum[0].previousBidSumOfBidder;
  }

  return totalBidAmount;
};

const validateBidAmount = (bid: IBid, totalBidAmount: number): void => {
  if (bid.bidHistory.length === 0 && bid.baseBidPrice >= totalBidAmount) {
    throw new AppError(
      `Bid Amount Must be greater than Base Bid Price. Current base bid price is ${bid.baseBidPrice}`,
      HttpStatusCodes.BAD_REQUEST
    );
  }

  if (totalBidAmount <= bid.currentHighestBid) {
    throw new AppError(
      `Your bid must be higher than the current highest bid. Current highest bid is ${bid.currentHighestBid}`,
      HttpStatusCodes.BAD_REQUEST
    );
  }
};

const updateBidDetails = async (
  bidRepositoryDb: BidRepository,
  newBidHistoryId: mongoose.Types.ObjectId,
  bidId: mongoose.Types.ObjectId,
  totalBidAmount: number,
  bidderId: string
): Promise<void> => {
  await bidRepositoryDb.placeBid(
    newBidHistoryId,
    bidId,
    totalBidAmount,
    new mongoose.Types.ObjectId(bidderId)
  );
};

// export const handlePlaceBid = async (
//   bidderId: string,
//   bidProductId: string,
//   bidAmount: string,
//   bidRepositoryDb: BidRepository,
//   bidHistoryRepositoryDb: BidHistoryRepository
// ) => {
//   console.log(
//     `  bidderId: string,
//   bidProductId: string,
//   bidAmount: string,`,
//     bidderId,
//     bidProductId,
//     bidAmount
//   );

//   const bid = await bidRepositoryDb.getBidDetails(bidProductId);
//   //if cant find bid on data base throw error
//   if (!bid) {
//     throw new AppError("Bid not found", HttpStatusCodes.BAD_GATEWAY);
//   }

//   //owner of the bid is not allowed to place bid on their bid products
//   if (bidderId == String(bid.userId)) {
//     throw new AppError(
//       "Owner of the Bid is Not Allowed To Bid On Their Products",
//       HttpStatusCodes.BAD_REQUEST
//     );
//   }

//   //function to check weather bid ended or not
//   const isBidEnded = (endTime: Date) => {
//     const currentTime = new Date().getTime();

//     const bidEndTime = endTime.getTime();

//     return currentTime < bidEndTime;
//   };

//   //if bid is ended throw new error
//   if (isBidEnded(bid.bidEndTime)) {
//     throw new AppError(
//       "Cant Bid The bid Have Ended ",
//       HttpStatusCodes.BAD_REQUEST
//     );
//   }
//   console.log("bid is ", bid);

//   const currentDate = new Date(Date.now());

//   //if bid history.length==0 means no one has bidded on the product so create new bid history entity
//   const currentHighestBid = bid.currentHighestBid;
//   let totalBidAmount = parseInt(bidAmount);
//   const bidderPreviousBidSumOnProduct =
//     await bidHistoryRepositoryDb.getUserPreviousBidsSumOnProduct(
//       new mongoose.Types.ObjectId(bidderId),
//       new mongoose.Types.ObjectId(bidProductId)
//     );

//   console.log("bidderPreviousBidSumOnProduct ", bidderPreviousBidSumOnProduct);
//   // console.log('bidderPreviousBidSumOnProduct[0].previousBidSumOfUser ',bidderPreviousBidSumOnProduct[0].previousBidSumOfBidder);

//   bidderPreviousBidSumOnProduct.length > 0
//     ? (totalBidAmount +=
//         bidderPreviousBidSumOnProduct[0].previousBidSumOfBidder)
//     : (totalBidAmount = totalBidAmount);

//   console.log(`bidAmount ${bidAmount}
//   totalBidAmount ${totalBidAmount}
//   i`);

//   if (bid.bidHistory.length === 0) {
//     //check if the bid amount is greater than the base bidPrice

//     if (bid.baseBidPrice >= totalBidAmount) {
//       throw new AppError(
//         `Bid Amount Must be greater that Base Bid Price current base bid price is  ${bid.baseBidPrice}`,
//         HttpStatusCodes.BAD_REQUEST
//       );
//     }

//     const newBidHistoryEntity: CreateBidHistoryEntityType =
//       createBidHistoryEntity(
//         bidderId,
//         String(bid._id),
//         bidProductId,
//         bidAmount,
//         currentDate
//       );

//     console.log("newBidHistoryEntity ", newBidHistoryEntity);
//     const newBidHistory = (await bidHistoryRepositoryDb.createNewBidHistory(
//       newBidHistoryEntity
//     )) as IBidHistory;

//     await bidRepositoryDb.placeBid(
//       new mongoose.Types.ObjectId(newBidHistory?._id as string),
//       bid._id,
//       totalBidAmount,
//       (bid.highestBidderId = new mongoose.Types.ObjectId(bidderId))
//     );

//     // return totalBidAmount;
//   } else {
//     //if there is bid history that means people have already bidded on the product
//     //already have a bid history entity so check weather the bid amount is greater than the current highest bid
//     // if not throw error
//     if (totalBidAmount <= currentHighestBid) {
//       throw new AppError(
//         `Your bid must be higher than the current highest bid. current highest bid is ${currentHighestBid}`,
//         HttpStatusCodes.BAD_REQUEST
//       );
//     }
//     const newBidHistoryEntity: CreateBidHistoryEntityType =
//       createBidHistoryEntity(
//         bidderId,
//         String(bid._id),
//         bidProductId,
//         bidAmount,
//         currentDate
//       );

//     //create new document in bidhistory collection

//     const newBidHistory = await bidHistoryRepositoryDb.createNewBidHistory(
//       newBidHistoryEntity
//     );

//     await bidRepositoryDb.placeBid(
//       new mongoose.Types.ObjectId(newBidHistory?._id as string),
//       bid._id,
//       totalBidAmount,
//       (bid.highestBidderId = new mongoose.Types.ObjectId(bidderId))
//     );

//   }
//   io.emit('newHighestBid', {
//     bidProductId,
//     highestBid: totalBidAmount,
//   });
//   return totalBidAmount;

// };
