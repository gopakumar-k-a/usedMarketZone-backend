"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleGetTransactionDetailsOfBidAdmin = void 0;
const handleGetTransactionDetailsOfBidAdmin = async (page = 1, limit = 5, searchQuery = "", sort = "", shipmentStatus, paymentStatus = "", fromDate = "", toDate = "", bidRepository) => {
    const { transactions, totalDocuments, currentPage } = await bidRepository.getTransactionDetailsOfBidEndedProductsAdmin(page, limit, searchQuery, sort, shipmentStatus, paymentStatus, fromDate, toDate);
    return {
        transactions,
        totalDocuments,
        currentPage,
    };
};
exports.handleGetTransactionDetailsOfBidAdmin = handleGetTransactionDetailsOfBidAdmin;
