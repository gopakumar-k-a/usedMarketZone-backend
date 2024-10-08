
import crypto from 'crypto';

export const generateOTP = (): number => {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < 6; i++) {
        otp += digits[Math.floor(crypto.randomInt(0, digits.length))];
    }
    return Number(otp);
};
