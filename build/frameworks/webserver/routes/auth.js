"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userDbRepository_1 = require("../../../application/repositories/userDbRepository");
const userRepositoryMongoDb_1 = require("../../../frameworks/database/mongodb/repositories/userRepositoryMongoDb");
const authController_1 = __importDefault(require("../../../adapters/authController/authController"));
const authService_1 = require("../../services/authService");
const authServiceInterface_1 = require("../../../application/services/authServiceInterface");
const authRouter = () => {
    const router = express_1.default.Router();
    const controller = (0, authController_1.default)(userDbRepository_1.userDbRepository, userRepositoryMongoDb_1.userRepositoryMongoDb, authService_1.authService, authServiceInterface_1.authServiceInterface);
    router.post("/send-otp", controller.otpSend);
    router.post("/resend-otp", controller.resendOtpHandler);
    router.post("/verify-sign-up", controller.verifyOtpRegister);
    router.post("/login", controller.userLogIn);
    router.post("/google-login", controller.googleAuthenticator);
    router.post("/forgot-password", controller.handleForgotPasswordOtpSend);
    router.post("/verfiy-forgot-password", controller.handleForgotPasswordOtpVerify);
    router.post("/reset-password", controller.handleResetPassword);
    router.get("/refresh-access-token", controller.refreshAccessToken);
    return router;
};
exports.default = authRouter;
