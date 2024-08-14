import { Types } from "mongoose";
import { AdminBidRequestMongoDb } from "../../frameworks/database/mongodb/repositories/adminBidRequestRepositoryMongoDb";

export const adminBidRequestDb = (
  repository: ReturnType<AdminBidRequestMongoDb>
) => {
  const createBidRequestAdmin = async (
    bidProductId: string,
    bidderId: string
  ) => await repository.createBidRequestAdmin(bidProductId, bidderId);
  const getBidRequestsFromDb = async (
    search: string = "",
    page: number = 1,
    limit: number = 5,
    sort: string = "createdAt_desc"
  ) => await repository.getBidRequestsFromDb(search, page, limit, sort);
  const getUserWiseBidRequests = async (userId: Types.ObjectId) =>
    await repository.getUserWiseBidRequests(userId);
  return {
    createBidRequestAdmin,
    getBidRequestsFromDb,
    getUserWiseBidRequests,
  };
};

export type AdminBidRequestDbRepository = ReturnType<typeof adminBidRequestDb>;

export type AdminBidRequestDbInterface = typeof adminBidRequestDb;
