import { AdminBidRequestDbInterface } from "../../repositories/adminBidRequestDbRepository";

export const handleGetBidRequests=async(adminBidRequestDb:ReturnType<AdminBidRequestDbInterface>)=>{

    const bidRequests=await adminBidRequestDb.getBidRequestsFromDb()

    return bidRequests
}