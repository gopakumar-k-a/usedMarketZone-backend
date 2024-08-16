"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const TransactionSchema = new mongoose_1.default.Schema({
    fromUserId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        require: true,
        ref: "User",
    },
    toUserId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },
    amount: Number,
    status: {
        type: String,
        required: true,
        enum: ["captured", "failed", "escrow", "released"],
        default: "escrow",
    },
    transactionType: {
        type: String,
        default: "credit",
    },
    shipmentStatus: {
        type: String,
        enum: [
            "not_shipped",
            "shipped_to_admin",
            "received_by_admin",
            "shipped_to_buyer",
            "delivered",
        ],
        default: "not_shipped",
    },
    trackingNumbers: {
        shippedToAdminTrackingNumber: {
            type: String,
            default: null,
        },
        shippedToBuyerTrackingNumber: {
            type: String,
            default: null,
        },
    },
    productId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Products",
    },
    bidId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
    },
}, { timestamps: true });
const Transaction = mongoose_1.default.model("Transaction", TransactionSchema);
exports.Transaction = Transaction;
