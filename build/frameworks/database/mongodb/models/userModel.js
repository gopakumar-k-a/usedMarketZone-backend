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
exports.User = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const userSchema = new mongoose_1.Schema({
    firstName: {
        type: String,
        trim: true,
        maxlength: 32,
    },
    lastName: {
        type: String,
        trim: true,
        maxlength: 32,
    },
    userName: {
        type: String,
        trim: true,
        maxlength: 32,
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please add a valid email"],
    },
    phone: {
        type: Number,
        maxlength: 10,
    },
    password: {
        type: String,
        trim: true,
    },
    role: {
        type: String,
        trim: true,
        default: "user",
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    bio: {
        type: String,
        default: "",
    },
    imageUrl: {
        type: String,
        default: "",
    },
    followers: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', default: [] }],
    following: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', default: [] }],
}, { timestamps: true });
const User = (0, mongoose_1.model)("User", userSchema);
exports.User = User;
