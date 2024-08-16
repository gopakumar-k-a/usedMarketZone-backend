"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bookmarkSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "User",
        required: true
    },
    postIds: [{
            type: mongoose_1.default.Types.ObjectId,
            ref: "Post",
            required: true
        }],
}, { timestamps: true });
const Bookmark = mongoose_1.default.models.Bookmark || mongoose_1.default.model("Bookmark", bookmarkSchema);
exports.default = Bookmark;
