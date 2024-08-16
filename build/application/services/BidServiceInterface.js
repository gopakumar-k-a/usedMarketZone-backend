"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bidServiceInterface = void 0;
const bidServiceInterface = (bidService) => {
    const processBidClosure = async (bidRepository, bidHistoryRepo, notificationRepo, bidId, productId, notificationService) => bidService.processBidClosure(bidRepository, bidHistoryRepo, notificationRepo, bidId, productId, notificationService);
    return {
        processBidClosure,
    };
};
exports.bidServiceInterface = bidServiceInterface;
