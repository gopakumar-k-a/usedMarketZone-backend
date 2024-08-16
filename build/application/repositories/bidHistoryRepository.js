"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bidHistoryRepository = void 0;
const bidHistoryRepository = (repository) => {
    const createNewBidHistory = async (createBidHistoryEntity) => await repository.createNewBidHistory(createBidHistoryEntity);
    const getUserPreviousBidsSumOnProduct = async (userId, bidProductId) => repository.getUserPreviousBidsSumOnProduct(userId, bidProductId);
    const getUserBidHistoryOnProduct = async (userId, productId) => await repository.getUserBidHistoryOnProduct(userId, productId);
    const getProductBidHistoryAdmin = async (bidProductId) => await repository.getProductBidHistoryAdmin(bidProductId);
    const getBidParticipents = async (bidWinnerId, productId) => repository.getBidParticipents(bidWinnerId, productId);
    const getUserParticipatingBids = async (userId) => repository.getUserParticipatingBids(userId);
    const getClaimableBidDetails = async (userId, productId) => await repository.getClaimableBidDetails(userId, productId);
    return {
        createNewBidHistory,
        getUserPreviousBidsSumOnProduct,
        getUserBidHistoryOnProduct,
        getProductBidHistoryAdmin,
        getBidParticipents,
        getUserParticipatingBids,
        getClaimableBidDetails
    };
};
exports.bidHistoryRepository = bidHistoryRepository;
