import { Types } from "mongoose";
import { BidRepository } from "../../application/repositories/bidRepository";
import { BidHistoryRepository } from "../../application/repositories/bidHistoryRepository";
import { NotificationRepository } from "../../application/repositories/notificationRepository";
import { NotificationServiceInterface } from "../../application/services/notificationServiceInterface.ts";
import { createNotificationEntity } from "../../entities/createNotificationEntity";

export const bidService = () => {
  const processBidClosure = async (
    bidRepository: BidRepository,
    bidHistoryRepo: BidHistoryRepository,
    notificationRepo: NotificationRepository,

    bidId: Types.ObjectId,
    productId: Types.ObjectId,
    notificationService: ReturnType<NotificationServiceInterface>
  ): Promise<void> => {
    await bidRepository.markBidAsEnded(bidId);
    const bid = await bidRepository.getBidById(String(bidId));
    if (!bid) {
      return;
    }

    const bidWinner = bid.highestBidderId;
    if (!bidWinner) {
      return;
    }

    const amountToBePaid = bid.currentHighestBid;

    const bidParticipents = await bidHistoryRepo.getBidParticipents(
      bidWinner,
      new Types.ObjectId(productId)
    );

    const newWinnerNotificationEntity = createNotificationEntity(
      "bidWin",
      null,
      String(bidWinner),
      "unread",
      String(productId),
      "",
      String(bidId),
      ""
    );
    const winnerNotification = await notificationRepo.createNotification(
      newWinnerNotificationEntity
    );

    notificationService.sendRealTimeNotification(
      String(bidWinner),
      "bidWin",
      winnerNotification,
      ""
    );

    if (bidParticipents.length > 0) {
      const sendNotificationToBidParticipents = async (userId: string) => {
        const newParticipentNotificationEntity = createNotificationEntity(
          "bidLose",
          null,
          userId,
          "unread",
          String(productId),
          "",
          String(bidId),
          ""
        );
        const participentNotification =
          await notificationRepo.createNotification(
            newParticipentNotificationEntity
          );

        notificationService.sendRealTimeNotification(
          userId,
          "bidLose",
          participentNotification,
          ""
        );
      };
      bidParticipents.map((userId: Types.ObjectId) => {
        sendNotificationToBidParticipents(String(userId));
      });
    }
  };

  return {
    processBidClosure,
  };
};

export type BidService = typeof bidService;
