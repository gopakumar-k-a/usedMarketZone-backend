"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionRepository = void 0;
const transactionRepository = (repository) => {
    const addNewEscrowTransaction = async (transactionEntity) => await repository.addNewEscrowTransaction(transactionEntity);
    const getTransactionById = async (transactionId) => await repository.getTransactionById(transactionId);
    const getTransactionByProductId = async (productId) => await repository.getTransactionByProductId(productId);
    const shipProductToAdmin = async (productId, trackingNumber) => await repository.shipProductToAdmin(productId, trackingNumber);
    const adminReceivesProduct = async (transactionId) => repository.adminReceivesProduct(transactionId);
    const adminShipsProductToWinner = async (transactionId, trackingNumber) => await repository.adminShipsProductToWinner(transactionId, trackingNumber);
    const releasePayment = async (transactionId) => await repository.releasePayment(transactionId);
    const transactionStatistics = async () => await repository.transactionStatistics();
    const lastTransactionsAdmin = async () => await repository.lastTransactionsAdmin();
    const getTransactionHistoryUser = async (userId) => await repository.getTransactionHistoryUser(userId);
    return {
        addNewEscrowTransaction,
        shipProductToAdmin,
        adminReceivesProduct,
        adminShipsProductToWinner,
        getTransactionById,
        releasePayment,
        getTransactionByProductId,
        transactionStatistics,
        lastTransactionsAdmin,
        getTransactionHistoryUser
    };
};
exports.transactionRepository = transactionRepository;
