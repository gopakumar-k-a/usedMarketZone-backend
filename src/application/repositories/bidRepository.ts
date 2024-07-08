import { CreateBidEntityType } from "../../entities/bidding/createBidEntity";
import { BidRepositoryMongoDb } from "../../frameworks/database/mongodb/repositories/bidRepositoryMongoDb";
import { IBid } from "../../frameworks/database/mongodb/models/bidModel";

export const bidDbRepository = (
  repository: ReturnType<BidRepositoryMongoDb>
) => {
  const addBidAfterAdminAccept = async (createBidEntity: CreateBidEntityType) =>
    await repository.addBidAfterAdminAccept(createBidEntity);
  const getBidDetails = async (productId: string): Promise<IBid|null> =>
    await repository.getBidDetails(productId);
  const getBidById = async (bidId: string): Promise<IBid | null> =>
    await repository.getBidById(bidId);
  const updateBid = async (
    bidId: string,
    update: IBid
  ) => await repository.updateBid(bidId, update);

  return {
    addBidAfterAdminAccept,
    getBidDetails,
    getBidById,
    updateBid,
  };
};

export type BidRepository = ReturnType<typeof bidDbRepository>;

export type BidInterface = typeof bidDbRepository;
