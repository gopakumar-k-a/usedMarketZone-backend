"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleKycRequestAdmin = exports.handleChangeNotificationStatus = exports.handleUnfollowUser = exports.handleFollowUser = exports.removeProfilePicUrl = exports.updateUserPassword = exports.modifyUserAccess = exports.updateUserImage = exports.updateUserProfile = void 0;
const httpStatusCodes_1 = require("../../../types/httpStatusCodes");
const appError_1 = __importDefault(require("../../../utils/appError"));
const read_1 = require("./read");
const app_1 = require("../../../app");
const socket_1 = require("../../../frameworks/webSocket/socket");
const createNotificationEntity_1 = require("../../../entities/createNotificationEntity");
const mongoose_1 = require("mongoose");
const updateUserProfile = async (userData, userId, userRepository) => {
    if (!userData) {
        throw new appError_1.default("try again something went wrong", httpStatusCodes_1.HttpStatusCodes.UNAUTHORIZED);
    }
    const updatedUserObj = await userRepository.updateUserProfile(userData, userId);
    const formatedUserData = await (0, read_1.removeSensitiveFields)(updatedUserObj);
    return formatedUserData;
};
exports.updateUserProfile = updateUserProfile;
const updateUserImage = async (imageUrl, userId, userRepository) => {
    const updatedUserObj = await userRepository.updateUserImage(imageUrl, userId);
    const formatedUserData = await (0, read_1.removeSensitiveFields)(updatedUserObj);
    return formatedUserData;
};
exports.updateUserImage = updateUserImage;
const modifyUserAccess = async (userId, userRepository) => {
    const updatedUser = await userRepository.modifyUserAccess(userId);
    if (!updatedUser) {
        throw new appError_1.default("user not found ", httpStatusCodes_1.HttpStatusCodes.NOT_FOUND);
    }
    return updatedUser;
};
exports.modifyUserAccess = modifyUserAccess;
const updateUserPassword = async (currentPassword, newPassword, userId, dbRepositoryUser, userService) => {
    const user = (await dbRepositoryUser.getUserById(userId));
    if (!user) {
        throw new appError_1.default("No user found with the provided user ID", httpStatusCodes_1.HttpStatusCodes.NOT_FOUND);
    }
    const userPassword = user.password;
    const isPasswordValid = await userService.comparePassword(currentPassword, userPassword);
    if (!isPasswordValid) {
        throw new appError_1.default("Current password is incorrect", httpStatusCodes_1.HttpStatusCodes.UNAUTHORIZED);
    }
    const hashedPassword = await userService.encryptPassword(newPassword);
    const userEmail = user.email;
    await dbRepositoryUser.updateUserPassword(userEmail, hashedPassword);
    return;
};
exports.updateUserPassword = updateUserPassword;
const removeProfilePicUrl = async (userId, dbRepositoryUser) => {
    const updatedUser = await dbRepositoryUser.removeProfilePicUrl(userId);
    if (!updatedUser) {
        throw new appError_1.default("invalid User ", httpStatusCodes_1.HttpStatusCodes.NOT_FOUND);
    }
    const removedSensitiveFields = await (0, read_1.removeSensitiveFields)(updatedUser);
    return removedSensitiveFields;
};
exports.removeProfilePicUrl = removeProfilePicUrl;
const handleFollowUser = async (userId, userToFollowId, dbRepositoryUser, dbRepositoryNotification) => {
    const userToFollowUserName = await dbRepositoryUser.followUser(userId, userToFollowId);
    const recieverSocketId = (0, socket_1.getRecieverSocketId)(userToFollowId);
    const newNotificationEntity = (0, createNotificationEntity_1.createNotificationEntity)("follow", userId, userToFollowId, "unread", undefined, undefined, undefined, undefined, undefined);
    const newNotification = await dbRepositoryNotification.createNotification(newNotificationEntity);
    if (recieverSocketId && userToFollowUserName) {
        const notificationData = {
            title: "You have a new message",
            //@ts-ignore
            description: `${userToFollowUserName} started following you`,
            userToFollowId,
            //@ts-ignore
            notificationType: "follow",
            newNotification,
        };
        console.log("new notification data ", notificationData);
        app_1.io.to(recieverSocketId).emit("notification", notificationData);
    }
    return;
};
exports.handleFollowUser = handleFollowUser;
const handleUnfollowUser = async (userId, userToUnFollowId, dbRepositoryUser, dbRepositoryNotification) => {
    await Promise.all([
        dbRepositoryUser.unFollowUser(userId, userToUnFollowId),
        dbRepositoryNotification.removeFollowNotification(userId, userToUnFollowId),
    ]);
    return;
};
exports.handleUnfollowUser = handleUnfollowUser;
const handleChangeNotificationStatus = async (userId, dbRepositoryNotification) => {
    await dbRepositoryNotification.changeUnreadStatusNotification(userId);
    return;
};
exports.handleChangeNotificationStatus = handleChangeNotificationStatus;
const handleKycRequestAdmin = async (kycId, type, kycRepository) => {
    const updatedKyc = await kycRepository.handleKycRequestAdmin(new mongoose_1.Types.ObjectId(kycId), type);
    return updatedKyc;
};
exports.handleKycRequestAdmin = handleKycRequestAdmin;
