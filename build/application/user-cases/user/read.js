"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleGetKycRequestsAdmin = exports.handleGetKycByUserId = exports.handleGetFollowingById = exports.handleGetFollowersById = exports.handleGetNumOfFollowById = exports.handleGetSuggestedUsers = exports.handleGetUserPostDetails = exports.handleGetUserPosts = exports.getAllUsers = exports.checkUserNameAvailabilty = exports.getUserProfile = void 0;
exports.removeSensitiveFields = removeSensitiveFields;
const mongoose_1 = require("mongoose");
const httpStatusCodes_1 = require("../../../types/httpStatusCodes");
const appError_1 = __importDefault(require("../../../utils/appError"));
async function removeSensitiveFields(object) {
    const { _id, firstName, lastName, userName, email, role, createdAt, updatedAt, imageUrl, phone, bio, isActive, followers, following, numOfFollowers, numOfFollowing, } = object;
    // Format dates
    const formattedCreatedAt = new Date(createdAt).toLocaleString().split(",")[0];
    const formattedUpdatedAt = new Date(updatedAt).toLocaleString().split(",")[0];
    return {
        _id,
        firstName,
        userName,
        lastName,
        email,
        role,
        createdAt: formattedCreatedAt,
        updatedAt: formattedUpdatedAt,
        imageUrl,
        phone,
        bio,
        isActive,
        followers,
        following,
        numOfFollowers,
        numOfFollowing,
    };
}
const getUserProfile = async (userId, userRepository) => {
    if (!userId) {
        throw new appError_1.default("try again something went wrong", httpStatusCodes_1.HttpStatusCodes.UNAUTHORIZED);
    }
    const user = await userRepository.getUserById(userId);
    const data = removeSensitiveFields(user);
    return data;
};
exports.getUserProfile = getUserProfile;
const checkUserNameAvailabilty = async (userName, userId, userRepository) => {
    const user = await userRepository.getUserByUserName(userName);
    if (user) {
        return false;
    }
    else {
        return true;
    }
};
exports.checkUserNameAvailabilty = checkUserNameAvailabilty;
const getAllUsers = async (startIndex, limit, userRepository) => {
    const { users, totalDocuments } = await userRepository.getAllUsers(startIndex, limit);
    return { users, totalDocuments };
};
exports.getAllUsers = getAllUsers;
const handleGetUserPosts = async (userId, productRepository) => {
    const userPosts = await productRepository.getUserPosts(userId);
    if (!userPosts) {
        return 0;
    }
    return userPosts;
};
exports.handleGetUserPosts = handleGetUserPosts;
const handleGetUserPostDetails = async (postId, productRepository) => {
    const postDetails = await productRepository.getUserPostDetailsAdmin(postId);
    if (!postDetails) {
        new appError_1.default("No Product Data Found , Check Post Id", httpStatusCodes_1.HttpStatusCodes.BAD_GATEWAY);
    }
    return postDetails;
};
exports.handleGetUserPostDetails = handleGetUserPostDetails;
const handleGetSuggestedUsers = async (userId, userRepository) => {
    const suggestedUsers = await userRepository.getSuggestedUsers(userId);
    return suggestedUsers;
};
exports.handleGetSuggestedUsers = handleGetSuggestedUsers;
const handleGetNumOfFollowById = async (userId, userRepository) => {
    const numOfFollow = await userRepository.getNumOfFollowById(userId);
    if (!numOfFollow) {
        throw new appError_1.default("cant find number of follow check user id ", httpStatusCodes_1.HttpStatusCodes.BAD_GATEWAY);
    }
    return numOfFollow;
};
exports.handleGetNumOfFollowById = handleGetNumOfFollowById;
const handleGetFollowersById = async (userId, userRepository) => {
    const followerUsers = userRepository.getFollowersById(userId);
    return followerUsers;
};
exports.handleGetFollowersById = handleGetFollowersById;
const handleGetFollowingById = async (userId, userRepository) => {
    const followingUsers = userRepository.getFollowingById(userId);
    return followingUsers;
};
exports.handleGetFollowingById = handleGetFollowingById;
const handleGetKycByUserId = async (userId, kycRepository) => {
    const kycData = await kycRepository.getKycByUserId(new mongoose_1.Types.ObjectId(userId));
    return kycData;
};
exports.handleGetKycByUserId = handleGetKycByUserId;
const handleGetKycRequestsAdmin = async (page = 1, limit = 5, searchQuery = "", sort = "", kycRepository) => {
    const { kycData, totalDocuments, currentPage } = await kycRepository.getKycAdmin(page, limit, searchQuery, sort);
    return { kycData, totalDocuments, currentPage };
};
exports.handleGetKycRequestsAdmin = handleGetKycRequestsAdmin;
