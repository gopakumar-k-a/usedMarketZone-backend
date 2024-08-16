"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const adminBidRequestScema = new mongoose_1.default.Schema({
    bidderId: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'User'
    },
    bidProductId: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'Product'
    }
}, { timestamps: true });
const AdminBidRequest = mongoose_1.default.model('AdminBidRequest', adminBidRequestScema);
exports.default = AdminBidRequest;
