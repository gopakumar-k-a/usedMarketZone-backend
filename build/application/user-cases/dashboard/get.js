"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleGetTransactionStastics = exports.handleGetAdminStatistics = void 0;
const handleGetAdminStatistics = async (postReportDb, productDb, userDb) => {
    const [numberOfReportsResult, numberOfProductsResult, numberOfUsersResult] = await Promise.all([
        postReportDb.getNumberOfPostReports(),
        productDb.getNumberOfProducts(),
        userDb.getNumberOfUsers(),
    ]);
    const statistics = {
        numberOfReports: numberOfReportsResult.numberOfReports,
        numberOfProducts: numberOfProductsResult.numberOfProducts,
        numberOfBidProducts: numberOfProductsResult.numberOfBidProducts,
        numberOfNonBidProducts: numberOfProductsResult.numberOfNonBidProducts,
        numberOfUsers: numberOfUsersResult.numberOfUsers,
    };
    return statistics;
};
exports.handleGetAdminStatistics = handleGetAdminStatistics;
const handleGetTransactionStastics = async (transactionDb) => {
    const [transactions, lastTransactions] = await Promise.all([
        transactionDb.transactionStatistics(),
        transactionDb.lastTransactionsAdmin(),
    ]);
    return { transactions, lastTransactions };
};
exports.handleGetTransactionStastics = handleGetTransactionStastics;
