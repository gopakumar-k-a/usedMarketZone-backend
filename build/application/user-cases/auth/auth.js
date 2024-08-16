"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.verifyForgotPasswordOtp = exports.forgotPasswordSendOtp = exports.googleAuthenticate = exports.handleRefreshAccessToken = exports.userAuthenticate = exports.resendOtp = exports.sendOtp = exports.VerifyAndRegister = void 0;
const user_1 = __importDefault(require("../../../entities/user"));
const appError_1 = __importDefault(require("../../../utils/appError"));
const httpStatusCodes_1 = require("../../../types/httpStatusCodes");
const generateOtp_1 = require("../../../utils/generateOtp");
const otp_1 = __importDefault(require("../../../entities/otp"));
const read_1 = require("../user/read");
const VerifyAndRegister = async (user, userRepository, userService, otp) => {
    const otpDoc = await userRepository.otpByEmail(user.email);
    if (otpDoc && otpDoc.otp == otp) {
        user.email = user.email.toLowerCase();
        const isExistingEmail = await userRepository.getUserByEmail(user?.email);
        if (isExistingEmail) {
            throw new appError_1.default("user email already exists", httpStatusCodes_1.HttpStatusCodes.CONFLICT);
        }
        const decryptedPass = (await userService.verifyToken(user.password));
        user.password = await userService.encryptPassword(decryptedPass?.payload);
        const { firstName, lastName, email, phone, password } = user;
        const userNameCreator = async (firstName, lastName) => {
            let userName = "";
            let isAvailable = false;
            while (!isAvailable) {
                userName = `${firstName.toLowerCase()}_${lastName.toLowerCase()}_${Math.floor(Math.random() * 10000)}`;
                let existingUser = await userRepository.getUserByUserName(userName);
                isAvailable = !existingUser;
            }
            return userName;
        };
        const createdUserName = await userNameCreator(firstName, lastName);
        const userEntity = (0, user_1.default)(firstName, lastName, email, phone, password, createdUserName, "");
        const createdUser = await userRepository.addUser(userEntity);
        return createdUser.email;
    }
    else {
        throw new appError_1.default("user not registered Invalid Otp", httpStatusCodes_1.HttpStatusCodes.CONFLICT);
    }
};
exports.VerifyAndRegister = VerifyAndRegister;
const sendOtp = async (user, userRepository, userService, isResend = false) => {
    if (!isResend) {
        const isExistingEmail = await userRepository.getUserByEmail(user?.email);
        if (isExistingEmail) {
            throw new appError_1.default("user email already exists", httpStatusCodes_1.HttpStatusCodes.CONFLICT);
        }
        user.password = userService.generateToken(user.password);
    }
    const otp = (0, generateOtp_1.generateOTP)();
    const otpEntity = (0, otp_1.default)(user.email, otp);
    await userRepository.addOtp(otpEntity);
    await userService.sendOtpEmail(user.email, otp);
    return user;
};
exports.sendOtp = sendOtp;
const resendOtp = async (userData, userRepository, userService) => {
    const user = await userRepository.getUserByEmail(userData.email);
    if (user) {
        throw new appError_1.default("User Exists", httpStatusCodes_1.HttpStatusCodes.NOT_FOUND);
    }
    return await (0, exports.sendOtp)(userData, userRepository, userService, true);
};
exports.resendOtp = resendOtp;
const userAuthenticate = async (email, pass, userRepository, userService) => {
    const userData = await userRepository.getUserByEmail(email);
    if (!userData) {
        throw new appError_1.default("this user doesn't exist", httpStatusCodes_1.HttpStatusCodes.UNAUTHORIZED);
    }
    if (userData.isActive == false) {
        throw new appError_1.default("cannot sign in authentication blocked by admin ", httpStatusCodes_1.HttpStatusCodes.UNAUTHORIZED);
    }
    const isPasswordCorrect = await userService.comparePassword(pass, userData.password);
    if (!isPasswordCorrect) {
        throw new appError_1.default("Sorry your password was incorrect", httpStatusCodes_1.HttpStatusCodes.UNAUTHORIZED);
    }
    const user = await (0, read_1.removeSensitiveFields)(userData);
    const role = user.role;
    const jwtPayload = {
        _id: user._id,
        role,
    };
    const accessToken = await userService.generateAccessToken(JSON.stringify(jwtPayload));
    const refreshToken = await userService.generateRefreshToken(JSON.stringify(jwtPayload));
    return { user, role, refreshToken, accessToken };
};
exports.userAuthenticate = userAuthenticate;
const handleRefreshAccessToken = async (cookies, dbUserRepository, authService) => {
    if (!cookies?.refreshToken) {
        throw new appError_1.default("Invalid token!", httpStatusCodes_1.HttpStatusCodes.UNAUTHORIZED);
    }
    const refreshToken = cookies.refreshToken;
    const decoded = authService.verifyToken(refreshToken);
    if (!decoded) {
        throw new appError_1.default("Token expired or invalid", httpStatusCodes_1.HttpStatusCodes.UNAUTHORIZED);
    }
    const customPayload = JSON.parse(decoded.payload);
    const jwtPayload = {
        _id: customPayload._id,
        role: customPayload.role,
    };
    const newRefreshToken = authService.generateRefreshToken(JSON.stringify(jwtPayload));
    return {
        accessToken: newRefreshToken,
    };
};
exports.handleRefreshAccessToken = handleRefreshAccessToken;
const googleAuthenticate = async (userCred, userRepository, userService) => {
    const userData = await userRepository.getUserByEmail(userCred.email);
    let user;
    let token;
    const role = "user";
    if (userData) {
        const jwtPayload = {
            _id: userData._id,
            role: "user",
        };
        token = await userService.generateToken(JSON.stringify(jwtPayload));
        const userWithoutPass = await (0, read_1.removeSensitiveFields)(userData);
        user = userWithoutPass;
    }
    else {
        const generatePassword = (Math.random().toString(36).slice(-5) + "A1@")
            .split("")
            .sort(() => Math.random() - 0.5)
            .join("");
        const hashedPassword = await userService.encryptPassword(generatePassword);
        const createdUserName = `${userCred.firstName.toLowerCase()}_${userCred.lastName.toLowerCase()}_${Math.floor(1000 + Math.random() * 9000)}`;
        const userEntity = (0, user_1.default)(userCred.firstName, userCred.lastName, userCred.email, userCred.phone ? userCred.phone : "0", hashedPassword, createdUserName, userCred.imageUrl);
        const createdUser = await userRepository.addUser(userEntity);
        const userWithoutPass = await (0, read_1.removeSensitiveFields)(createdUser);
        user = userWithoutPass;
        const jwtPayload = {
            _id: createdUser._id,
            role: "user",
        };
        token = await userService.generateToken(JSON.stringify(jwtPayload));
    }
    return { token, user, role };
};
exports.googleAuthenticate = googleAuthenticate;
const forgotPasswordSendOtp = async (email, userRepository, userService) => {
    const user = userRepository.getUserByEmail(email);
    if (!user) {
        throw new appError_1.default("No user Exist in the email please check Email or do Sign Up ", httpStatusCodes_1.HttpStatusCodes.BAD_GATEWAY);
    }
    const otp = (0, generateOtp_1.generateOTP)();
    await userService.sendOtpEmail(email, otp);
    const otpEntity = (0, otp_1.default)(email, otp);
    await userRepository.addOtp(otpEntity);
    const jwtPayload = {
        email,
        otp,
    };
    const otpToken = await userService.generateToken(JSON.stringify(jwtPayload));
    return otpToken;
};
exports.forgotPasswordSendOtp = forgotPasswordSendOtp;
const verifyForgotPasswordOtp = async (otpToken, otp, userRepository, userService) => {
    const decoded = userService.verifyToken(otpToken);
    const decodedData = JSON.parse(decoded.payload);
    const otpDoc = await userRepository.otpByEmail(decodedData.email);
    const user = await userRepository.getUserByEmail(decodedData.email);
    if (!decodedData.otp || !user || !otpDoc) {
        throw new appError_1.default(" invalid request ", httpStatusCodes_1.HttpStatusCodes.UNAUTHORIZED);
    }
    if (decodedData.otp != otp || otp != otpDoc.otp) {
        throw new appError_1.default("verification failed wrong otp ", httpStatusCodes_1.HttpStatusCodes.UNAUTHORIZED);
    }
    return decodedData.otp == otp;
};
exports.verifyForgotPasswordOtp = verifyForgotPasswordOtp;
const resetPassword = async (email, newPassword, dbRepositoryUser, userService) => {
    const hashedPassword = await userService.encryptPassword(newPassword);
    dbRepositoryUser.updateUserPassword(email, hashedPassword);
    return true;
};
exports.resetPassword = resetPassword;
