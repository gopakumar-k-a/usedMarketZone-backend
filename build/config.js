"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const configKeys = {
    MONGODB_URI: process.env.MONGODB_URI,
    PORT: process.env.PORT,
    JWT_SECRET: process.env.JWT_SECRET,
    MAIL_SENDER: process.env.MAIL_SENDER,
    MAIL_SENDER_PASS: process.env.MAIL_SENDER_PASS,
    CLIENT_URL: process.env.CLIENT_URL,
    SERVER_DOMAIN: process.env.SERVER_DOMAIN,
    RAZOR_KEY_ID: process.env.RAZOR_KEY_ID,
    RAZOR_KEY_SECRET: process.env.RAZOR_KEY_SECRET,
};
exports.default = configKeys;
