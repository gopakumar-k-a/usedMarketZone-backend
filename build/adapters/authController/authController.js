"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const appError_1 = __importDefault(require("../../utils/appError"));
const httpStatusCodes_1 = require("../../types/httpStatusCodes");
const auth_1 = require("../../application/user-cases/auth/auth");
const authController = (userDbRepository, userDbImpl, authService, authServiceInterface) => {
    const dbRepositoryUser = userDbRepository(userDbImpl());
    const userService = authServiceInterface(authService());
    const otpSend = (0, express_async_handler_1.default)(async (req, res) => {
        const requiredFields = [
            "firstName",
            "lastName",
            "email",
            "phone",
            "password",
        ];
        const missingFields = requiredFields.filter((field) => !(field in req.body));
        if (missingFields.length > 0) {
            throw new appError_1.default(`Missing required fields: ${missingFields.join(", ")}`, httpStatusCodes_1.HttpStatusCodes.BAD_REQUEST);
        }
        const userData = await (0, auth_1.sendOtp)(req.body, dbRepositoryUser, userService);
        res.status(httpStatusCodes_1.HttpStatusCodes.OK).json({
            status: true,
            message: `otp send successfully`,
            userData,
        });
    });
    const resendOtpHandler = (0, express_async_handler_1.default)(async (req, res) => {
        const { email } = req.body;
        if (!email) {
            throw new appError_1.default("Email is required", httpStatusCodes_1.HttpStatusCodes.BAD_REQUEST);
        }
        const userData = await (0, auth_1.resendOtp)(req.body, dbRepositoryUser, userService);
        res.status(httpStatusCodes_1.HttpStatusCodes.OK).json({
            status: true,
            message: "OTP resent successfully",
            userData,
        });
    });
    const verifyOtpRegister = (0, express_async_handler_1.default)(async (req, res) => {
        const { userData, otp } = req.body;
        const registeredEmail = await (0, auth_1.VerifyAndRegister)(userData, dbRepositoryUser, userService, otp);
        res.status(httpStatusCodes_1.HttpStatusCodes.OK).json({
            status: true,
            message: `user registered and otp verified successfully`,
            email: registeredEmail,
        });
    });
    const userLogIn = (0, express_async_handler_1.default)(async (req, res) => {
        const { email, password } = req.body;
        if (!email || !password) {
            throw new appError_1.default(`all fields are required `, httpStatusCodes_1.HttpStatusCodes.BAD_REQUEST);
        }
        const { user, role, accessToken, refreshToken } = await (0, auth_1.userAuthenticate)(email, password, dbRepositoryUser, userService);
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 7.5 * 24 * 60 * 60 * 1000,
        });
        res.status(httpStatusCodes_1.HttpStatusCodes.OK).json({
            status: true,
            message: "success user log in success",
            accessToken,
            user,
            role,
        });
    });
    const refreshAccessToken = (0, express_async_handler_1.default)(async (req, res) => {
        const { refreshToken } = req.cookies;
        const { accessToken } = await (0, auth_1.handleRefreshAccessToken)({ refreshToken }, dbRepositoryUser, userService);
        res.status(httpStatusCodes_1.HttpStatusCodes.OK).json({
            status: true,
            message: "new access token generated",
            accessToken,
        });
    });
    const googleAuthenticator = (0, express_async_handler_1.default)(async (req, res) => {
        const { token, user, role } = await (0, auth_1.googleAuthenticate)(req.body, dbRepositoryUser, userService);
        if (!token || !user || !role) {
            throw new appError_1.default("some thing went wrong please try again ", httpStatusCodes_1.HttpStatusCodes.BAD_REQUEST);
        }
        res.status(httpStatusCodes_1.HttpStatusCodes.OK).json({
            status: true,
            message: "success user log in success",
            token,
            user,
            role,
        });
    });
    const handleForgotPasswordOtpSend = (0, express_async_handler_1.default)(async (req, res) => {
        const { email } = req.body;
        const otpToken = await (0, auth_1.forgotPasswordSendOtp)(email, dbRepositoryUser, userService);
        res.status(httpStatusCodes_1.HttpStatusCodes.OK).json({
            success: "true",
            message: "otp send to user success",
            otpToken,
            email,
        });
    });
    const handleForgotPasswordOtpVerify = (0, express_async_handler_1.default)(async (req, res) => {
        const { email, otpToken, otp } = req.body;
        const otpCheck = await (0, auth_1.verifyForgotPasswordOtp)(otpToken, otp, dbRepositoryUser, userService);
        res.status(httpStatusCodes_1.HttpStatusCodes.OK).json({
            success: true,
            message: "forgot password otp verification success",
            otpCheck,
            email,
        });
    });
    const handleResetPassword = (0, express_async_handler_1.default)(async (req, res) => {
        const { email, newPassword } = req.body;
        if (!email || !newPassword) {
            throw new appError_1.default("All fields are required", httpStatusCodes_1.HttpStatusCodes.BAD_GATEWAY);
        }
        const updateStatus = await (0, auth_1.resetPassword)(email, newPassword, dbRepositoryUser, userService);
        if (!updateStatus) {
            throw new appError_1.default("something went wrong try again ", httpStatusCodes_1.HttpStatusCodes.UNAUTHORIZED);
        }
        res.status(httpStatusCodes_1.HttpStatusCodes.OK).json({
            success: true,
            message: "password reseted successfully",
        });
    });
    return {
        verifyOtpRegister,
        otpSend,
        resendOtpHandler,
        userLogIn,
        googleAuthenticator,
        handleForgotPasswordOtpSend,
        handleForgotPasswordOtpVerify,
        handleResetPassword,
        refreshAccessToken,
    };
};
exports.default = authController;
