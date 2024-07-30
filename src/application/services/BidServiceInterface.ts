import { Types } from "mongoose";
import { BidService, bidService } from "../../frameworks/services/bidService";
import { BidRepository } from "../repositories/bidRepository";
import { BidHistoryRepository } from "../repositories/bidHistoryRepository";
import { NotificationRepository } from "../repositories/notificationRepository";

export const bidServiceInterface = (bidService: ReturnType<BidService>) => {
  const processBidClosure = async (
    bidRepository: BidRepository,
    bidHistoryRepo:BidHistoryRepository,
    notificationRepo:NotificationRepository,
    bidId: Types.ObjectId
  ): Promise<void> => bidService.processBidClosure(bidRepository,bidHistoryRepo,notificationRepo, bidId);

  return {
    processBidClosure
  };
};

export type BidServiceInterface = typeof bidServiceInterface;
