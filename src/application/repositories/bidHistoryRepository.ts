import mongoose, { Types } from "mongoose";
import { CreateBidHistoryEntityType } from "../../entities/bidding/createBidHistory";
import { IBidHistory } from "../../frameworks/database/mongodb/models/bidHistoryModel";
import { BidHistoryRepositoryMongoDb } from "../../frameworks/database/mongodb/repositories/bidHistoryRepositoryMongoDb";

export const bidHistoryRepository = (
  repository: ReturnType<BidHistoryRepositoryMongoDb>
) => {
  const createNewBidHistory = async (
    createBidHistoryEntity: CreateBidHistoryEntityType
  ): Promise<IBidHistory | null> =>
    await repository.createNewBidHistory(createBidHistoryEntity);
  const getUserPreviousBidsSumOnProduct = async (
    userId: Types.ObjectId,
    bidProductId: Types.ObjectId
  ) => repository.getUserPreviousBidsSumOnProduct(userId, bidProductId);
  const getUserBidHistoryOnProduct = async (
    userId: mongoose.Types.ObjectId,
    productId: mongoose.Types.ObjectId
  ) => await repository.getUserBidHistoryOnProduct(userId, productId);
  const getProductBidHistoryAdmin = async (
    bidProductId: mongoose.Types.ObjectId
  ) => await repository.getProductBidHistoryAdmin(bidProductId);
  const getBidParticipents = async (
    bidWinnerId: Types.ObjectId,
    productId: Types.ObjectId
  ) =>repository.getBidParticipents(bidWinnerId,productId)
  const getUserParticipatingBids = async (userId: Types.ObjectId) => repository.getUserParticipatingBids(userId)
  const getClaimableBidDetails = async (
    userId: Types.ObjectId,
    productId: Types.ObjectId
  ) => await repository.getClaimableBidDetails(userId,productId)
  return {
    createNewBidHistory,
    getUserPreviousBidsSumOnProduct,
    getUserBidHistoryOnProduct,
    getProductBidHistoryAdmin,
    getBidParticipents,
    getUserParticipatingBids,
    getClaimableBidDetails
  };
};

export type BidHistoryRepository = ReturnType<typeof bidHistoryRepository>;

export type BidHistoryInterface = typeof bidHistoryRepository;
