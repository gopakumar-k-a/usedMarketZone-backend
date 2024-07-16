import { CreateBidEntityType } from "../../entities/bidding/createBidEntity";
import { BidRepositoryMongoDb } from "../../frameworks/database/mongodb/repositories/bidRepositoryMongoDb";
import { IBid } from "../../frameworks/database/mongodb/models/bidModel";
import { Types } from "mongoose";

export const bidDbRepository = (
  repository: ReturnType<BidRepositoryMongoDb>
) => {
  const addBidAfterAdminAccept = async (createBidEntity: CreateBidEntityType) =>
    await repository.addBidAfterAdminAccept(createBidEntity);
  const getBidDetails = async (productId: string): Promise<IBid | null> =>
    await repository.getBidDetails(productId);
  const getBidById = async (bidId: string): Promise<IBid | null> =>
    await repository.getBidById(bidId);
  const updateBid = async (bidId: string, update: IBid) =>
    await repository.updateBid(bidId, update);

  const placeBid = async (
    bidHistoryId: Types.ObjectId,
    bidId: Types.ObjectId,
    currentHighestBid:number,
    highestBidderId:Types.ObjectId,
  ) => await repository.placeBid(bidHistoryId, bidId,currentHighestBid,highestBidderId);

  return {
    addBidAfterAdminAccept,
    getBidDetails,
    getBidById,
    updateBid,
    placeBid,
  };
};

export type BidRepository = ReturnType<typeof bidDbRepository>;

export type BidInterface = typeof bidDbRepository;
