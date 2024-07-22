import { Types } from "mongoose";
import { AdminBidRequestMongoDb } from "../../frameworks/database/mongodb/repositories/adminBidRequestRepositoryMongoDb";

// import const adminBidRequestDb=()=>{

// }

export const adminBidRequestDb =  (
  repository: ReturnType<AdminBidRequestMongoDb>
) => {
  const createBidRequestAdmin = async (
    bidProductId: string,
    bidderId: string
  ) => await repository.createBidRequestAdmin(bidProductId, bidderId);
  const getBidRequestsFromDb = async () => await repository.getBidRequestsFromDb()
  const getUserWiseBidRequests = async (userId: Types.ObjectId) =>await repository.getUserWiseBidRequests(userId)
  return {
    createBidRequestAdmin,
    getBidRequestsFromDb,
    getUserWiseBidRequests
  };
};


export type AdminBidRequestDbRepository = ReturnType<typeof adminBidRequestDb>;

export type AdminBidRequestDbInterface = typeof adminBidRequestDb;
