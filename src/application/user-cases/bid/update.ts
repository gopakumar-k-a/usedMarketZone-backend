import { BidInterface, BidRepository } from "../../repositories/bidRepository";
import { BidHistoryRepository } from "../../repositories/bidHistoryRepository";
import { createBidHistoryEntity } from "../../../entities/bidding/createBidHistory";
import { CreateBidHistoryEntityType } from "../../../entities/bidding/createBidHistory";
import AppError from "../../../utils/appError";
import { HttpStatusCodes } from "../../../types/httpStatusCodes";
import mongoose, { Types } from "mongoose";
import { IBid } from "../../../frameworks/database/mongodb/models/bidModel";
import { IBidHistory } from "../../../frameworks/database/mongodb/models/bidHistoryModel";
import { io } from "../../../app";
import { KycRepository } from "../../repositories/kycDbRepository";
import { createBidClaimerAddressEntity } from "../../../entities/bidding/createBidClaimerAddress";

export const handlePlaceBid = async (
  bidderId: string,
  bidProductId: string,
  bidAmount: string,
  bidRepositoryDb: BidRepository,
  bidHistoryRepositoryDb: BidHistoryRepository,
  kycRepositoryDb: KycRepository
): Promise<number> => {
  console.log("Placing bid with:", { bidderId, bidProductId, bidAmount });
  const isKycVerified = await kycRepositoryDb.checkKycIsVerified(
    new Types.ObjectId(bidderId)
  );

  if (!isKycVerified) {
    throw new AppError(
      "Can't place bid, Update KYC in Settings Only KYC accepted by admin are allowed to place bid",
      HttpStatusCodes.BAD_GATEWAY
    );
  }
  const bid = await bidRepositoryDb.getBidDetails(bidProductId);

  if (!bid) {
    throw new AppError("Bid not found", HttpStatusCodes.BAD_GATEWAY);
  }

  // if (bid.productData.isBlocked) {
  //   throw new AppError(
  //     "cant place Bid Bid is blocked By Admin",
  //     HttpStatusCodes.BAD_GATEWAY
  //   );
  // }

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
  const totalBidAmount = await calculateTotalBidAmount(
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

export const handleAddClaimerAddress = async (
  bidId: string,
  address: {
    country: string;
    state: string;
    district: string;
    city: string;
    postalCode: string;
    phone: string;
  },
  bidDb: ReturnType<BidInterface>
) => {
  const newAddressEntity = createBidClaimerAddressEntity(
    address.country,
    address.state,
    address.district,
    address.city,
    address.postalCode,
    address.phone
  );

  const newAddress=await bidDb.addBidClaimerAddress(new Types.ObjectId(bidId), newAddressEntity);

  console.log('new Adress ',newAddress);
  
  return newAddress
};
