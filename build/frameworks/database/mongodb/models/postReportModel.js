"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const postReportSchema = new mongoose_1.default.Schema({
    reporterId: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "User",
        required: true,
    },
    postId: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    reason: {
        type: String,
        required: true,
    },
    reasonType: {
        type: String,
        required: true,
    },
    actionTaken: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
const PostReport = mongoose_1.default.model('PostReport', postReportSchema);
exports.default = PostReport;
