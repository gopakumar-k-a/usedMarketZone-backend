"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionRepositoryMongoDb = void 0;
const TransactionModel_1 = require("../models/TransactionModel");
const appError_1 = __importDefault(require("../../../../utils/appError"));
const httpStatusCodes_1 = require("../../../../types/httpStatusCodes");
const transactionRepositoryMongoDb = () => {
    const addNewEscrowTransaction = async (transactionEntity) => {
        const transaction = new TransactionModel_1.Transaction({
            fromUserId: transactionEntity.getFromUserId(),
            toUserId: transactionEntity.getToUserId(),
            amount: transactionEntity.getAmount(),
            status: transactionEntity.getStatus(),
            bidId: transactionEntity.getBidId(),
            productId: transactionEntity.getProductId(),
        });
        await transaction.save();
        return transaction;
    };
    const getTransactionById = async (transactionId) => {
        const transaction = await TransactionModel_1.Transaction.findOne({ _id: transactionId });
        return transaction;
    };
    const getTransactionByProductId = async (productId) => {
        const transaction = await TransactionModel_1.Transaction.findOne({ productId: productId });
        return transaction;
    };
    const shipProductToAdmin = async (productId, trackingNumber) => {
        const transaction = await TransactionModel_1.Transaction.findOne({ productId });
        if (transaction) {
            transaction.shipmentStatus = "shipped_to_admin";
            transaction.trackingNumbers.shippedToAdminTrackingNumber = trackingNumber;
            await transaction.save();
            return transaction;
        }
        throw new appError_1.default("Transaction not found", httpStatusCodes_1.HttpStatusCodes.BAD_GATEWAY);
    };
    const adminReceivesProduct = async (transactionId) => {
        const updatedTransaction = await TransactionModel_1.Transaction.findByIdAndUpdate(transactionId, { shipmentStatus: "received_by_admin" }, { new: true });
        if (!updatedTransaction) {
            throw new appError_1.default("some thing went wrong cant change status ", httpStatusCodes_1.HttpStatusCodes.BAD_GATEWAY);
        }
        return updatedTransaction;
    };
    const adminShipsProductToWinner = async (transactionId, trackingNumber) => {
        const updatedTransaction = await TransactionModel_1.Transaction.findByIdAndUpdate(transactionId, {
            shipmentStatus: "shipped_to_buyer",
            "trackingNumbers.shippedToBuyerTrackingNumber": trackingNumber,
        }, { new: true });
        if (!updatedTransaction) {
            throw new appError_1.default("some thing went wrong cant change status ", httpStatusCodes_1.HttpStatusCodes.BAD_GATEWAY);
        }
        return updatedTransaction;
    };
    const buyerConfirmsReceipt = async (transactionId) => {
        await TransactionModel_1.Transaction.findByIdAndUpdate(transactionId, {
            shipmentStatus: "delivered",
        });
    };
    const releasePayment = async (transactionId) => {
        const updatedTransaction = await TransactionModel_1.Transaction.findByIdAndUpdate(transactionId, {
            $set: { status: "released", shipmentStatus: "delivered" },
        }, { new: true });
        if (!updatedTransaction) {
            throw new appError_1.default("some thing went wrong cant change payment status status ", httpStatusCodes_1.HttpStatusCodes.BAD_GATEWAY);
        }
        return;
    };
    const transactionStatistics = async () => {
        const transactions = await TransactionModel_1.Transaction.find({}, { shipmentStatus: 1, status: 1 });
        return transactions;
    };
    const lastTransactionsAdmin = async () => {
        const transactions = await TransactionModel_1.Transaction.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "fromUserId",
                    foreignField: "_id",
                    as: "userData",
                },
            },
            {
                $unwind: {
                    path: "$userData",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    amount: 1,
                    productId: 1,
                    createdAt: 1,
                    fromUserId: 1,
                    fromUserName: "$userData.userName",
                    bidId: 1,
                },
            },
            {
                $sort: {
                    createdAt: -1,
                },
            },
            {
                $limit: 10,
            },
        ]);
        return transactions;
    };
    const getTransactionHistoryUser = async (userId) => {
        const transactionHistory = await TransactionModel_1.Transaction.find({ fromUserId: userId }, {
            amount: 1,
            createdAt: 1,
            productId: 1,
        });
        return transactionHistory;
    };
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
        getTransactionHistoryUser,
    };
};
exports.transactionRepositoryMongoDb = transactionRepositoryMongoDb;
