import { Types } from "mongoose";
import { BidService, bidService } from "../../frameworks/services/bidService";
import { BidRepository } from "../repositories/bidRepository";

export const bidServiceInterface = (bidService: ReturnType<BidService>) => {
  const processBidClosure = async (
    bidRepository: BidRepository,
    bidId: Types.ObjectId
  ): Promise<void> => bidService.processBidClosure(bidRepository, bidId);

  return {
    processBidClosure
  };
};

export type BidServiceInterface = typeof bidServiceInterface;
