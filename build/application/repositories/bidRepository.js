"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bidDbRepository = void 0;
const bidDbRepository = (repository) => {
    const addBidAfterAdminAccept = async (createBidEntity) => await repository.addBidAfterAdminAccept(createBidEntity);
    const getBidDetails = async (productId) => await repository.getBidDetails(productId);
    const getBidById = async (bidId) => await repository.getBidById(bidId);
    const updateBid = async (bidId, update) => await repository.updateBid(bidId, update);
    const placeBid = async (bidHistoryId, bidId, currentHighestBid, highestBidderId) => await repository.placeBid(bidHistoryId, bidId, currentHighestBid, highestBidderId);
    const updateBidWithClaimedUserId = async (productId, fromUserId) => await repository.updateBidWithClaimedUserId(productId, fromUserId);
    const addBidClaimerAddress = async (bidId, addressEntity) => await repository.addBidClaimerAddress(bidId, addressEntity);
    const bidResultsForOwner = async (productId, userId) => await repository.bidResultsForOwner(productId, userId);
    const addTransactionIdToBid = async (productId, transactionId) => await repository.addTransactionIdToBid(productId, transactionId);
    const markBidAsEnded = async (bidId) => await repository.markBidAsEnded(bidId);
    const getTransactionDetailsOfBidEndedProductsAdmin = async (page = 1, limit = 5, searchQuery = "", sort = "", shipmentStatus = "", paymentStatus = "", fromDate = "", toDate = "") => await repository.getTransactionDetailsOfBidEndedProductsAdmin(page, limit, searchQuery, sort, shipmentStatus, paymentStatus, fromDate, toDate);
    return {
        addBidAfterAdminAccept,
        getBidDetails,
        getBidById,
        updateBid,
        placeBid,
        updateBidWithClaimedUserId,
        addBidClaimerAddress,
        bidResultsForOwner,
        addTransactionIdToBid,
        markBidAsEnded,
        getTransactionDetailsOfBidEndedProductsAdmin,
    };
};
exports.bidDbRepository = bidDbRepository;
