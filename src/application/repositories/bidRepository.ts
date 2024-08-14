import { CreateBidEntityType } from "../../entities/bidding/createBidEntity";
import { BidRepositoryMongoDb } from "../../frameworks/database/mongodb/repositories/bidRepositoryMongoDb";
import { IBid } from "../../frameworks/database/mongodb/models/bidModel";
import { Types } from "mongoose";
import { CreateBidClaimerAddressEntityType } from "../../entities/bidding/createBidClaimerAddress";

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
    currentHighestBid: number,
    highestBidderId: Types.ObjectId
  ) =>
    await repository.placeBid(
      bidHistoryId,
      bidId,
      currentHighestBid,
      highestBidderId
    );
  const updateBidWithClaimedUserId = async (
    productId: Types.ObjectId,
    fromUserId: Types.ObjectId
  ) => await repository.updateBidWithClaimedUserId(productId, fromUserId);
  const addBidClaimerAddress = async (
    bidId: Types.ObjectId,
    addressEntity: CreateBidClaimerAddressEntityType
  ) => await repository.addBidClaimerAddress(bidId, addressEntity);
  const bidResultsForOwner = async (
    productId: Types.ObjectId,
    userId: Types.ObjectId
  ) => await repository.bidResultsForOwner(productId, userId);
  const addTransactionIdToBid = async (
    productId: Types.ObjectId,
    transactionId: Types.ObjectId
  ) => await repository.addTransactionIdToBid(productId, transactionId);
  const markBidAsEnded = async (bidId: Types.ObjectId) =>
    await repository.markBidAsEnded(bidId);
  const getTransactionDetailsOfBidEndedProductsAdmin = async (
    page: number = 1,
    limit: number = 5,
    searchQuery: string = "",
    sort: string = "",
    shipmentStatus: string = "",
    paymentStatus: string = "",
    fromDate: string = "",
    toDate: string = ""
  ) =>
    await repository.getTransactionDetailsOfBidEndedProductsAdmin(
      page,
      limit,
      searchQuery,
      sort,
      shipmentStatus,
      paymentStatus,
    fromDate,
    toDate
    );
  return {
    addBidAfterAdminAccept,
    getBidDetails,
    getBidById,
    updateBid,
    placeBid,
    updateBidWithClaimedUserId,
    addBidClaimerAddress,
    bidResultsForOwner,
    addTransactionIdToBid,
    markBidAsEnded,
    getTransactionDetailsOfBidEndedProductsAdmin,
  };
};

export type BidRepository = ReturnType<typeof bidDbRepository>;

export type BidInterface = typeof bidDbRepository;
