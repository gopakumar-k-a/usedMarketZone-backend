"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleGetBidResultForOwner = exports.handleGetClaimProductDetails = exports.handleGetMyParticipatingBids = exports.handleAdminGetBidHistoryOfProduct = exports.handleGetBidDetailsOfUserOnProduct = exports.handleGetUserWiseBidRequests = exports.handleGetBidRequests = void 0;
const mongoose_1 = require("mongoose");
const handleGetBidRequests = async (page, limit, searchQuery, sort, adminBidRequestDb) => {
    const { bidRequests, totalDocuments, currentPage } = await adminBidRequestDb.getBidRequestsFromDb(searchQuery, page, limit, sort);
    return { bidRequests, totalDocuments, currentPage };
};
exports.handleGetBidRequests = handleGetBidRequests;
const handleGetUserWiseBidRequests = async (userId, adminBidRequestDb, productDb) => {
    const userWiseBidRequests = await productDb.getUserBids(new mongoose_1.Types.ObjectId(userId));
    return userWiseBidRequests;
};
exports.handleGetUserWiseBidRequests = handleGetUserWiseBidRequests;
const handleGetBidDetailsOfUserOnProduct = async (userId, bidProductId, bidHistoryDb) => {
    const bidHistory = await bidHistoryDb.getUserBidHistoryOnProduct(new mongoose_1.Types.ObjectId(userId), new mongoose_1.Types.ObjectId(bidProductId));
    return bidHistory;
};
exports.handleGetBidDetailsOfUserOnProduct = handleGetBidDetailsOfUserOnProduct;
const handleAdminGetBidHistoryOfProduct = async (productId, bidHistoryDb) => {
    const bidHistory = await bidHistoryDb.getProductBidHistoryAdmin(new mongoose_1.Types.ObjectId(productId));
    return bidHistory;
};
exports.handleAdminGetBidHistoryOfProduct = handleAdminGetBidHistoryOfProduct;
const handleGetMyParticipatingBids = async (userId, bidHistoryDb) => {
    const myParticipatingBids = await bidHistoryDb.getUserParticipatingBids(new mongoose_1.Types.ObjectId(userId));
    return myParticipatingBids;
};
exports.handleGetMyParticipatingBids = handleGetMyParticipatingBids;
const handleGetClaimProductDetails = async (userId, productId, bidHistoryDb) => {
    const claimableBid = await bidHistoryDb.getClaimableBidDetails(new mongoose_1.Types.ObjectId(userId), new mongoose_1.Types.ObjectId(productId));
    return claimableBid;
};
exports.handleGetClaimProductDetails = handleGetClaimProductDetails;
const handleGetBidResultForOwner = async (productId, userId, bidDb) => {
    const result = await bidDb.bidResultsForOwner(new mongoose_1.Types.ObjectId(productId), new mongoose_1.Types.ObjectId(userId));
    return result;
};
exports.handleGetBidResultForOwner = handleGetBidResultForOwner;
