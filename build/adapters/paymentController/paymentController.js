"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentController = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const update_1 = require("../../application/user-cases/payment/update");
const httpStatusCodes_1 = require("../../types/httpStatusCodes");
const get_1 = require("../../application/user-cases/payment/get");
const paymentController = (transactionDbRepository, transactionImpl, walletDbRepository, walletImpl, bidDbRepository, bidImpl) => {
    const dbTransaction = transactionDbRepository(transactionImpl());
    const dbWallet = walletDbRepository(walletImpl());
    const dbBid = bidDbRepository(bidImpl());
    const createPaymentOrder = (0, express_async_handler_1.default)(async (req, res) => {
        const { _id: userId } = req.user;
        const { amount, currency, receipt, notes } = req.body;
        const order = await (0, update_1.handleCreatePaymentOrder)(amount, currency, receipt, notes, userId);
        res.status(httpStatusCodes_1.HttpStatusCodes.OK).json({
            success: true,
            message: "order created successfully",
            order,
        });
    });
    const capturePayment = (0, express_async_handler_1.default)(async (req, res) => {
        const { payment_id, fromUserId, toUserId, amount, currency, productId, bidId, } = req.body;
        const captureStatus = await (0, update_1.handleCapturePayment)(payment_id, fromUserId, toUserId, amount, currency, productId, bidId, dbTransaction, dbWallet, dbBid);
        res.status(httpStatusCodes_1.HttpStatusCodes.OK).json({
            success: true,
            message: "order created successfully",
            captureStatus: captureStatus.captureStatus,
            transactionData: captureStatus.transaction,
        });
    });
    const getUserWallet = (0, express_async_handler_1.default)(async (req, res) => {
        const { _id: userId } = req.user;
        const wallet = await (0, get_1.handleGetUserWallet)(userId, dbWallet);
        res.status(httpStatusCodes_1.HttpStatusCodes.OK).json({
            success: true,
            message: "wallet Data  Retrived successfully",
            wallet,
        });
    });
    const shipProductToAdmin = (0, express_async_handler_1.default)(async (req, res) => {
        const { productId, trackingNumber } = req.body;
        await (0, update_1.handleShipProductToAdmin)(productId, trackingNumber, dbTransaction);
        res.status(httpStatusCodes_1.HttpStatusCodes.OK).json({
            success: true,
            message: "tracking data submitted to admin successfully",
        });
    });
    const getTransactionHistoryUser = (0, express_async_handler_1.default)(async (req, res) => {
        const { _id: userId } = req.user;
        const transactionHistory = await (0, get_1.handleGetTransactionHistoryUser)(userId, dbTransaction);
        res.status(httpStatusCodes_1.HttpStatusCodes.OK).json({
            success: true,
            message: "transaction history retrived successfully",
            transactionHistory,
        });
    });
    return {
        createPaymentOrder,
        capturePayment,
        getUserWallet,
        shipProductToAdmin,
        getTransactionHistoryUser,
    };
};
exports.paymentController = paymentController;
