// src/utils/otpUtils.ts

// export const generateOTP = (): number => {
//     const digits = '0123456789';
//     let otp = '';
//     for (let i = 0; i < 6; i++) {
//         otp += digits[Math.floor(crypto.randomInt(0, digits.length))];
//     }
//     return parseInt(otp, 10);
// };
import crypto from 'crypto';

export const generateOTP = (): number => {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < 6; i++) {
        otp += digits[Math.floor(crypto.randomInt(0, digits.length))];
    }
    return Number(otp);
};
