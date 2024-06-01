
import mongoose, { Schema, model } from 'mongoose';

const otpSchema: Schema = new Schema({
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
        default:()=> Date.now()
    },
    expiresAt: {
        type: Date,
        default: () => new Date(+new Date() + 15 * 60 * 1000)
    } // 15 minutes expiry
});

const Otp=model('otp',otpSchema)

export default Otp