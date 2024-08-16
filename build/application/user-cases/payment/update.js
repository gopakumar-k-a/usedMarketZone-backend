"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleProductDeliveredToWinner = exports.handleShipProductToBidWinner = exports.handleChangeShipmentStatusToAdminRecieved = exports.handleShipProductToAdmin = exports.handleCapturePayment = exports.handleCreatePaymentOrder = void 0;
const razorpay_1 = __importDefault(require("razorpay"));
const appError_1 = __importDefault(require("../../../utils/appError"));
const httpStatusCodes_1 = require("../../../types/httpStatusCodes");
const createTransactionEntity_1 = require("../../../entities/createTransactionEntity");
const mongoose_1 = require("mongoose");
const createWalletHistoryEntity_1 = require("../../../entities/createWalletHistoryEntity");
const razorpay = new razorpay_1.default({
    key_id: "rzp_test_xgAbYbKWLNZHR0",
    key_secret: "pBaRn0FrJtHGQABUEkHfJwCZ",
});
const handleCreatePaymentOrder = async (amount, currency, receipt, notes, userId) => {
    if (notes.fromUserId != userId) {
        throw new appError_1.default("Cant make payment ,payment is not secure ", httpStatusCodes_1.HttpStatusCodes.BAD_GATEWAY);
    }
    const options = {
        amount: Number(amount * 100),
        currency,
        receipt,
        notes,
    };
    try {
        const order = await razorpay.orders.create(options);
        return order;
    }
    catch (error) {
        throw new appError_1.default("Failed to create payment order", httpStatusCodes_1.HttpStatusCodes.INTERNAL_SERVER_ERROR);
    }
};
exports.handleCreatePaymentOrder = handleCreatePaymentOrder;
const handleCapturePayment = async (payment_id, fromUserId, toUserId, amount, currency, productId, bidId, transactionDb, walletDb, bidDb) => {
    let captureStatus = "failed";
    try {
        const payment = await razorpay.payments.fetch(payment_id);
        if (payment.status === "captured") {
            captureStatus = "captured";
        }
        else {
            // Capture the payment
            const captureResponse = await razorpay.payments.capture(payment_id, amount, currency);
            captureStatus =
                captureResponse.status === "captured" ? "captured" : "failed";
        }
        const newTransactionEntity = (0, createTransactionEntity_1.createTransactionEntity)(fromUserId, null, amount, "escrow", productId, bidId);
        const transaction = await transactionDb.addNewEscrowTransaction(newTransactionEntity);
        if (transaction) {
            await bidDb.addTransactionIdToBid(new mongoose_1.Types.ObjectId(productId), transaction._id);
        }
        if (captureStatus === "captured") {
            await Promise.all([
                bidDb.updateBidWithClaimedUserId(new mongoose_1.Types.ObjectId(productId), new mongoose_1.Types.ObjectId(fromUserId)),
            ]);
        }
        return { captureStatus, transaction };
    }
    catch (error) {
        console.error(error);
        throw new appError_1.default("Failed to capture payment", httpStatusCodes_1.HttpStatusCodes.INTERNAL_SERVER_ERROR);
    }
};
exports.handleCapturePayment = handleCapturePayment;
const handleShipProductToAdmin = async (productId, trackingNumber, transactionDb) => {
    const transaction = await transactionDb.getTransactionByProductId(productId);
    if (!transaction) {
        throw new appError_1.default("cant find transaction", httpStatusCodes_1.HttpStatusCodes.BAD_GATEWAY);
    }
    if (transaction.shipmentStatus == "delivered") {
        throw new appError_1.default("can't change the status, product is already delivered ", httpStatusCodes_1.HttpStatusCodes.BAD_GATEWAY);
    }
    await transactionDb.shipProductToAdmin(productId, trackingNumber);
    return;
};
exports.handleShipProductToAdmin = handleShipProductToAdmin;
const handleChangeShipmentStatusToAdminRecieved = async (transactionId, transactionDb) => {
    const transaction = await transactionDb.getTransactionById(transactionId);
    if (!transaction) {
        throw new appError_1.default("cant find transaction", httpStatusCodes_1.HttpStatusCodes.BAD_GATEWAY);
    }
    if (transaction.shipmentStatus == "delivered") {
        throw new appError_1.default("can't change the status, product is already delivered ", httpStatusCodes_1.HttpStatusCodes.BAD_GATEWAY);
    }
    const updatedTransaction = await transactionDb.adminReceivesProduct(transactionId);
    return updatedTransaction;
};
exports.handleChangeShipmentStatusToAdminRecieved = handleChangeShipmentStatusToAdminRecieved;
const handleShipProductToBidWinner = async (transactionId, trackingNumber, transactionDb) => {
    const transaction = await transactionDb.getTransactionById(transactionId);
    if (!transaction) {
        throw new appError_1.default("cant find transaction", httpStatusCodes_1.HttpStatusCodes.BAD_GATEWAY);
    }
    if (transaction.shipmentStatus == "delivered") {
        throw new appError_1.default("can't change the status, product is already delivered ", httpStatusCodes_1.HttpStatusCodes.BAD_GATEWAY);
    }
    const updatedTransaction = await transactionDb.adminShipsProductToWinner(transactionId, trackingNumber);
    return updatedTransaction;
};
exports.handleShipProductToBidWinner = handleShipProductToBidWinner;
const handleProductDeliveredToWinner = async (transactionId, productId, bidId, adminId, productOwnerId, transactionDb, walletDb) => {
    const transaction = await transactionDb.getTransactionById(transactionId);
    if (!transaction) {
        throw new appError_1.default("cant find transaction", httpStatusCodes_1.HttpStatusCodes.BAD_GATEWAY);
    }
    if (transaction.shipmentStatus == "delivered") {
        throw new appError_1.default("can't change the status, product is already delivered ", httpStatusCodes_1.HttpStatusCodes.BAD_GATEWAY);
    }
    const commisionPercentage = 1;
    const commissionAmountInPaise = (transaction.amount * commisionPercentage) / 100;
    const amountAfterCommision = transaction.amount - commissionAmountInPaise;
    const adminWalletHistory = (0, createWalletHistoryEntity_1.createWalletHistoryEntity)(productId, bidId, commissionAmountInPaise);
    const productOwnerWalletHistory = (0, createWalletHistoryEntity_1.createWalletHistoryEntity)(productId, bidId, commissionAmountInPaise);
    await Promise.all([
        walletDb.addAmountToUserWallet(new mongoose_1.Types.ObjectId(adminId), commissionAmountInPaise, adminWalletHistory),
        walletDb.addAmountToUserWallet(new mongoose_1.Types.ObjectId(productOwnerId), amountAfterCommision, productOwnerWalletHistory),
        transactionDb.releasePayment(transactionId),
    ]);
};
exports.handleProductDeliveredToWinner = handleProductDeliveredToWinner;
