"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const otpSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true
    },
    otp: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        expires: 300,
        default: Date.now,
    },
});
const Otp = (0, mongoose_1.model)('otp', otpSchema);
exports.default = Otp;
