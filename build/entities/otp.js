"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = otpEntity;
function otpEntity(email, otp) {
    return {
        getEmail: () => email,
        getOtp: () => otp
    };
}
