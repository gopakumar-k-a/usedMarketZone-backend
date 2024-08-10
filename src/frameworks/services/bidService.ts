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
    console.log("this is bid id ", bidId);

    await bidRepository.markBidAsEnded(bidId);
    const bid = await bidRepository.getBidById(String(bidId));
    if (!bid) {
      console.error(`Bid with ID ${bidId} not found`);
      return;
    }

    const bidWinner = bid.highestBidderId;
    if (!bidWinner) {
      console.error(`No winner for bid ID ${bidId}`);
      return;
    }

    const amountToBePaid = bid.currentHighestBid;
    console.log(
      `Bid ID: ${bidId}, Bid Winner: ${bidWinner}, Amount to be Paid: ${amountToBePaid}`
    );

    const bidParticipents = await bidHistoryRepo.getBidParticipents(
      bidWinner,
      new Types.ObjectId(productId)
    );

    console.log(` bidParticipents ${bidParticipents}`);

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

    console.log("winner notification ", winnerNotification);

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
        console.log("participent notification ", participentNotification);

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
