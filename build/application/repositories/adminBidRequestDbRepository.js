"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminBidRequestDb = void 0;
const adminBidRequestDb = (repository) => {
    const createBidRequestAdmin = async (bidProductId, bidderId) => await repository.createBidRequestAdmin(bidProductId, bidderId);
    const getBidRequestsFromDb = async (search = "", page = 1, limit = 5, sort = "createdAt_desc") => await repository.getBidRequestsFromDb(search, page, limit, sort);
    const getUserWiseBidRequests = async (userId) => await repository.getUserWiseBidRequests(userId);
    return {
        createBidRequestAdmin,
        getBidRequestsFromDb,
        getUserWiseBidRequests,
    };
};
exports.adminBidRequestDb = adminBidRequestDb;
