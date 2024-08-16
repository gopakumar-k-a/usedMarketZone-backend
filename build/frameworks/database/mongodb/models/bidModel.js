"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bid = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const bidSchema = new mongoose_1.Schema({
    productId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: "Post",
    },
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    baseBidPrice: {
        type: Number,
        required: true,
    },
    currentHighestBid: {
        type: Number,
        default: 0,
        required: true,
    },
    bidEndTime: {
        type: Date,
        required: true,
    },
    bidHistory: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "BidHistory",
            default: [],
        },
    ],
    highestBidderId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
    },
    highestBidderHistoryId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Bidhistory",
    },
    isAdminVerified: {
        type: Boolean,
        default: true,
    },
    biddingStatus: {
        type: String,
        enum: ["active", "completed"],
        default: "active",
    },
    isBidAmountPaid: {
        type: Boolean,
        default: false,
    },
    claimedUserId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
    },
    isClaimerAddressAdded: {
        type: Boolean,
        default: false,
    },
    claimerAddress: {
        country: {
            type: String,
        },
        state: {
            type: String,
        },
        district: {
            type: String,
        },
        city: {
            type: String,
        },
        postalCode: {
            type: String,
        },
        phone: {
            type: String,
        },
    },
    transactionId: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "Transaction",
    },
    isBiddingEnded: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
exports.Bid = mongoose_1.default.model("bid", bidSchema);
