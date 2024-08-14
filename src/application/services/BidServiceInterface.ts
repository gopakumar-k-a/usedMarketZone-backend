import { Types } from "mongoose";
import { BidService } from "../../frameworks/services/bidService";
import { BidRepository } from "../repositories/bidRepository";
import { BidHistoryRepository } from "../repositories/bidHistoryRepository";
import { NotificationRepository } from "../repositories/notificationRepository";
import { NotificationServiceInterface } from "./notificationServiceInterface.ts";

export const bidServiceInterface = (bidService: ReturnType<BidService>) => {
  const processBidClosure = async (
    bidRepository: BidRepository,
    bidHistoryRepo: BidHistoryRepository,
    notificationRepo: NotificationRepository,
    bidId: Types.ObjectId,
    productId: Types.ObjectId,
    notificationService: ReturnType<NotificationServiceInterface>
  ): Promise<void> =>
    bidService.processBidClosure(
      bidRepository,
      bidHistoryRepo,
      notificationRepo,
      bidId,
      productId,
      notificationService
    );

  return {
    processBidClosure,
  };
};

export type BidServiceInterface = typeof bidServiceInterface;
