
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
        expires: 300, 
        default: Date.now,
      },
});

const Otp=model('otp',otpSchema)

export default Otp