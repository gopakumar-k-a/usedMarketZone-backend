import { BidInterface } from "../../repositories/bidRepository";

export const handleGetTransactionDetailsOfBidAdmin=async(bidRepository:ReturnType<BidInterface>)=>{

    const transactionDetails=await bidRepository.getTransactionDetailsOfBidEndedProductsAdmin()
    return transactionDetails
}