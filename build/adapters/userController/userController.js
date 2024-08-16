"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const httpStatusCodes_1 = require("../../types/httpStatusCodes");
const read_1 = require("../../application/user-cases/user/read");
const update_1 = require("../../application/user-cases/user/update");
const appError_1 = __importDefault(require("../../utils/appError"));
const create_1 = require("../../application/user-cases/user/create");
const get_1 = require("../../application/user-cases/search/get");
const get_2 = require("../../application/user-cases/notifications/get");
const userController = (userDbRepository, userDbImpl, authServiceInterface, authService, kycDbRepository, kycRepositoryImpl, productDbRepository, productRepositoryImpl, notificationRepository, notificationImpl) => {
    const dbRepositoryUser = userDbRepository(userDbImpl());
    const userService = authServiceInterface(authService());
    const dbRepositoryKyc = kycDbRepository(kycRepositoryImpl());
    const dbRepositoryProduct = productDbRepository(productRepositoryImpl());
    const dbNotification = notificationRepository(notificationImpl());
    const handleGetUserProfile = (0, express_async_handler_1.default)(async (req, res) => {
        const userId = req.params.userId;
        const userData = await (0, read_1.getUserProfile)(userId, dbRepositoryUser);
        res.status(httpStatusCodes_1.HttpStatusCodes.OK).json({
            status: "success",
            message: "User Details has been feteched",
            userData,
        });
    });
    const handleUserNameCheck = (0, express_async_handler_1.default)(async (req, res) => {
        const { userName, userId } = req.params;
        const userAvailablity = await (0, read_1.checkUserNameAvailabilty)(userName, userId, dbRepositoryUser);
        let message;
        if (userAvailablity) {
            message = "user name is available";
        }
        else {
            message = "user name is not available";
        }
        res.status(httpStatusCodes_1.HttpStatusCodes.OK).json({
            success: true,
            message,
            userAvailablity,
        });
    });
    const handleProfileUpdate = (0, express_async_handler_1.default)(async (req, res) => {
        const { userId } = req.params;
        const userData = req.body;
        const updatedUser = await (0, update_1.updateUserProfile)(userData, userId, dbRepositoryUser);
        res.status(httpStatusCodes_1.HttpStatusCodes.OK).json({
            status: true,
            message: "user profile updated successfully",
            updatedUser,
        });
    });
    const handleProfileImageUpdate = (0, express_async_handler_1.default)(async (req, res) => {
        const { userId } = req.params;
        const { imageUrl } = req.body;
        const updatedUser = await (0, update_1.updateUserImage)(imageUrl, userId, dbRepositoryUser);
        res.status(httpStatusCodes_1.HttpStatusCodes.OK).json({
            status: true,
            message: "udpated user profile ",
            updatedUser,
        });
    });
    const handleUserPasswordUpdate = (0, express_async_handler_1.default)(async (req, res) => {
        const { currentPassword, newPassword, confirmPassword } = req.body;
        const { userId } = req.params;
        if (!userId) {
            throw new appError_1.default("Missing required parameter: userId", httpStatusCodes_1.HttpStatusCodes.UNAUTHORIZED);
        }
        if (!currentPassword || !newPassword || !confirmPassword) {
            throw new appError_1.default("All fields (current password, new password, confirm password) are required", httpStatusCodes_1.HttpStatusCodes.UNAUTHORIZED);
        }
        if (newPassword !== confirmPassword) {
            throw new appError_1.default("New password and confirm password do not match", httpStatusCodes_1.HttpStatusCodes.UNAUTHORIZED);
        }
        await (0, update_1.updateUserPassword)(currentPassword, newPassword, userId, dbRepositoryUser, userService);
        res
            .status(httpStatusCodes_1.HttpStatusCodes.OK)
            .json({ success: true, message: "Password updated successfully!" });
    });
    const handleProfilePicRemove = (0, express_async_handler_1.default)(async (req, res) => {
        const { userId } = req.params;
        const updatedUser = await (0, update_1.removeProfilePicUrl)(userId, dbRepositoryUser);
        res.status(httpStatusCodes_1.HttpStatusCodes.OK).json({
            success: true,
            message: "user profile image removed successfully",
            updatedUser,
        });
    });
    const suggestedUsers = (0, express_async_handler_1.default)(async (req, res) => {
        const { _id } = req.user;
        const suggestedUsers = await (0, read_1.handleGetSuggestedUsers)(_id, dbRepositoryUser);
        res.status(httpStatusCodes_1.HttpStatusCodes.OK).json({
            success: true,
            message: "Suggested User Data Retrived successfully",
            suggestedUsers,
        });
    });
    const followUser = (0, express_async_handler_1.default)(async (req, res) => {
        const { _id } = req.user;
        const { followUserId } = req.params;
        await (0, update_1.handleFollowUser)(_id, followUserId, dbRepositoryUser, dbNotification);
        res.status(httpStatusCodes_1.HttpStatusCodes.OK).json({
            success: true,
            message: "Added User To Follow List",
        });
    });
    const unFollowUser = (0, express_async_handler_1.default)(async (req, res) => {
        const { _id } = req.user;
        const { unFollowUserId } = req.params;
        await (0, update_1.handleUnfollowUser)(_id, unFollowUserId, dbRepositoryUser, dbNotification);
        res.status(httpStatusCodes_1.HttpStatusCodes.OK).json({
            success: true,
            message: "Added User To Follow List",
        });
    });
    const getNumberOfFollowById = (0, express_async_handler_1.default)(async (req, res) => {
        const { userId } = req.params;
        const numOfFollow = await (0, read_1.handleGetNumOfFollowById)(userId, dbRepositoryUser);
        res.status(httpStatusCodes_1.HttpStatusCodes.OK).json({
            success: true,
            message: "number of followers retrived successfully",
            numOfFollow,
        });
    });
    const getFollowers = (0, express_async_handler_1.default)(async (req, res) => {
        const { _id } = req.user;
        const followerUsers = await (0, read_1.handleGetFollowersById)(_id, dbRepositoryUser);
        res.status(httpStatusCodes_1.HttpStatusCodes.OK).json({
            success: true,
            message: "followers fetched successfully",
            followerUsers,
        });
    });
    const getFollowing = (0, express_async_handler_1.default)(async (req, res) => {
        const { _id } = req.user;
        const followingUsers = await (0, read_1.handleGetFollowingById)(_id, dbRepositoryUser);
        res.status(httpStatusCodes_1.HttpStatusCodes.OK).json({
            success: true,
            message: "followers fetched successfully",
            followingUsers,
        });
    });
    const addNewKycRequest = (0, express_async_handler_1.default)(async (req, res) => {
        const { _id: userId } = req.user;
        await (0, create_1.handleCreateNewKycRequest)(userId, req.body, dbRepositoryKyc);
        res.status(httpStatusCodes_1.HttpStatusCodes.OK).json({
            success: true,
            message: "Kyc Request Added Successfully",
        });
    });
    const searchOnApp = (0, express_async_handler_1.default)(async (req, res) => {
        const { _id: userId } = req.user;
        const { query, filter, subFilter } = req.query;
        const results = await (0, get_1.handleSearchOnApp)(dbRepositoryUser, dbRepositoryProduct, userId, query, filter, subFilter);
        res.status(httpStatusCodes_1.HttpStatusCodes.OK).json({
            success: true,
            message: "search Results retrived successfully",
            results,
        });
    });
    const getUserNotifications = (0, express_async_handler_1.default)(async (req, res) => {
        const { _id: userId } = req.user;
        const userNotifications = await (0, get_2.handleGetUserNotifications)(userId, dbNotification);
        res.status(httpStatusCodes_1.HttpStatusCodes.OK).json({
            success: true,
            message: "notifications retrived successfully",
            userNotifications,
        });
    });
    const changeNotificationReadStatus = (0, express_async_handler_1.default)(async (req, res) => {
        const { _id: userId } = req.user;
        await (0, update_1.handleChangeNotificationStatus)(userId, dbNotification);
        res.status(httpStatusCodes_1.HttpStatusCodes.OK).json({
            success: true,
            message: "unread notification status changed to read successfully",
        });
    });
    const getMyKycData = (0, express_async_handler_1.default)(async (req, res) => {
        const { _id: userId } = req.user;
        const kycData = await (0, read_1.handleGetKycByUserId)(userId, dbRepositoryKyc);
        res.status(httpStatusCodes_1.HttpStatusCodes.OK).json({
            success: true,
            message: "kyc data retrived successfully",
            kycData,
        });
    });
    return {
        handleGetUserProfile,
        handleUserNameCheck,
        handleProfileUpdate,
        handleProfileImageUpdate,
        handleUserPasswordUpdate,
        handleProfilePicRemove,
        followUser,
        unFollowUser,
        suggestedUsers,
        getNumberOfFollowById,
        getFollowers,
        getFollowing,
        addNewKycRequest,
        searchOnApp,
        getUserNotifications,
        changeNotificationReadStatus,
        getMyKycData,
    };
};
exports.default = userController;
