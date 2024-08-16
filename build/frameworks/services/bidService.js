"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bidService = void 0;
const mongoose_1 = require("mongoose");
const createNotificationEntity_1 = require("../../entities/createNotificationEntity");
const bidService = () => {
    const processBidClosure = async (bidRepository, bidHistoryRepo, notificationRepo, bidId, productId, notificationService) => {
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
        const bidParticipents = await bidHistoryRepo.getBidParticipents(bidWinner, new mongoose_1.Types.ObjectId(productId));
        const newWinnerNotificationEntity = (0, createNotificationEntity_1.createNotificationEntity)("bidWin", null, String(bidWinner), "unread", String(productId), "", String(bidId), "");
        const winnerNotification = await notificationRepo.createNotification(newWinnerNotificationEntity);
        notificationService.sendRealTimeNotification(String(bidWinner), "bidWin", winnerNotification, "");
        if (bidParticipents.length > 0) {
            const sendNotificationToBidParticipents = async (userId) => {
                const newParticipentNotificationEntity = (0, createNotificationEntity_1.createNotificationEntity)("bidLose", null, userId, "unread", String(productId), "", String(bidId), "");
                const participentNotification = await notificationRepo.createNotification(newParticipentNotificationEntity);
                notificationService.sendRealTimeNotification(userId, "bidLose", participentNotification, "");
            };
            bidParticipents.map((userId) => {
                sendNotificationToBidParticipents(String(userId));
            });
        }
    };
    return {
        processBidClosure,
    };
};
exports.bidService = bidService;
