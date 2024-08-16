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
const mongoose_1 = __importStar(require("mongoose"));
const productSchema = new mongoose_1.Schema({
    productName: {
        type: String,
        required: true,
    },
    basePrice: {
        type: Number,
        required: true,
    },
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    productImageUrls: {
        type: [String],
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    subCategory: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: () => Date.now(),
    },
    productCondition: {
        type: String,
        required: true,
    },
    productAge: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    bookmarkedUsers: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    bookmarkedCount: {
        type: Number,
        default: 0,
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    isDeactivatedPost: {
        type: Boolean,
        default: false,
    },
    isSold: {
        type: Boolean,
        default: false,
    },
    isOtpVerified: {
        type: Boolean,
        default: false,
    },
    postStatus: {
        type: String,
        enum: ["draft", "active", "deactivated"],
        default: "draft",
    },
    isBidding: {
        type: Boolean,
        default: false,
    },
    isAdminAccepted: {
        type: Boolean,
        default: false,
    },
    bidAcceptedTime: {
        type: Date,
    },
    bidDuration: {
        day: { type: Number },
        hour: { type: Number },
        minute: { type: Number },
    },
    bidEndTime: {
        type: Date,
    },
    bidData: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "bid",
    },
}, {
    timestamps: true,
});
const Product = mongoose_1.default.model("Product", productSchema);
exports.default = Product;
