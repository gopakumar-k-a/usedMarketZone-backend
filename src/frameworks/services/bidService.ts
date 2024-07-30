import { Types } from "mongoose";
import { BidRepository } from "../../application/repositories/bidRepository";
import { BidHistoryRepository } from "../../application/repositories/bidHistoryRepository";
import { NotificationRepository } from "../../application/repositories/notificationRepository";

export const bidService = () => {
  const processBidClosure = async (
    bidRepository: BidRepository,
    bidHistoryRepo: BidHistoryRepository,
    notificationRepo:NotificationRepository,

    bidId: Types.ObjectId
  ): Promise<void> => {
    console.log("this is bid id ", bidId);

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
      bidId
    );

    console.log(` bidParticipents ${bidParticipents}`);
    

    // Notify all other bidders
    // const allBidders = await BidHistory.find({
    //   bidData: bidId,
    //   bidderId: { $ne: bidWinner }  // Exclude the highest bidder
    // }).select('bidderId');
  };

  return {
    processBidClosure,
  };
};

export type BidService = typeof bidService;
