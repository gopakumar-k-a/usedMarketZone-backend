"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authServiceInterface = void 0;
const authServiceInterface = (service) => {
    const encryptPassword = (password) => service.encryptPassword(password);
    const comparePassword = (password, hashedPassword) => service.comparePassword(password, hashedPassword);
    const generateToken = (payload) => service.generateToken(payload);
    const verifyToken = (token) => service.verifyToken(token);
    const sendOtpEmail = async (email, otp) => await service.sendOtpEmail(email, otp);
    const generateAccessToken = (payload) => service.generateAccessToken(payload);
    const generateRefreshToken = (payload) => service.generateRefreshToken(payload);
    return {
        encryptPassword,
        comparePassword,
        generateToken,
        verifyToken,
        sendOtpEmail,
        generateAccessToken,
        generateRefreshToken,
    };
};
exports.authServiceInterface = authServiceInterface;
