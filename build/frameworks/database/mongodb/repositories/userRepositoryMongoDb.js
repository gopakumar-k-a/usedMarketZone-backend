"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRepositoryMongoDb = void 0;
const userModel_1 = require("../models/userModel");
const otpSchema_1 = __importDefault(require("../models/otpSchema"));
const appError_1 = __importDefault(require("../../../../utils/appError"));
const httpStatusCodes_1 = require("../../../../types/httpStatusCodes");
const mongoose_1 = __importDefault(require("mongoose"));
const { ObjectId } = mongoose_1.default.Types;
const userRepositoryMongoDb = () => {
    const getUserByEmail = async (email) => {
        const userData = await userModel_1.User.aggregate([
            { $match: { email: email } },
            {
                $addFields: {
                    numOfFollowers: { $size: "$followers" },
                    numOfFollowing: { $size: "$following" },
                },
            },
        ]);
        return userData[0];
    };
    const getNumOfFollowById = async (userId) => {
        const numOfFollow = await userModel_1.User.aggregate([
            { $match: { _id: new ObjectId(userId) } },
            {
                $addFields: {
                    numOfFollowers: { $size: "$followers" },
                    numOfFollowing: { $size: "$following" },
                },
            },
            {
                $project: {
                    numOfFollowers: 1,
                    numOfFollowing: 1,
                },
            },
        ]);
        return numOfFollow[0];
    };
    const addUser = async (user) => {
        const newUser = new userModel_1.User({
            firstName: user.getFirstName(),
            lastName: user.getLastName(),
            email: user.getEmail(),
            phone: user.getPhone(),
            password: user.getPassword(),
            userName: user.getUserName(),
            imageUrl: user.getImageUrl(),
        });
        await newUser.save();
        return newUser;
    };
    const addOtp = async (otpData) => {
        const newOtp = new otpSchema_1.default({
            email: otpData.getEmail(),
            otp: otpData.getOtp(),
        });
        await newOtp.save();
    };
    const otpByEmail = async (email) => {
        const otp = await otpSchema_1.default.findOne({ email }).sort({ createdAt: -1 }).limit(1);
        return otp;
    };
    const getUserByUserName = async (userName) => {
        const user = await userModel_1.User.findOne({ userName });
        return user;
    };
    const getUserById = async (userId) => {
        const userData = await userModel_1.User.aggregate([
            { $match: { _id: new ObjectId(userId) } },
            {
                $addFields: {
                    numOfFollowers: { $size: "$followers" },
                    numOfFollowing: { $size: "$following" },
                },
            },
        ]);
        return userData[0];
    };
    const getUserWithOutPass = async (userId) => {
        const user = await userModel_1.User.findById(userId).select("-password");
        return user;
    };
    const updateUserProfile = async (userData, userId) => {
        const updatedUser = await userModel_1.User.findByIdAndUpdate(userId, { $set: userData }, { new: true, runValidators: true });
        return updatedUser;
    };
    const updateUserImage = async (imageUrl, userId) => {
        const updatedUser = await userModel_1.User.findByIdAndUpdate(userId, { $set: { imageUrl } }, { new: true, runValidators: true });
        return updatedUser;
    };
    const getAllUsers = async (startIndex, limit) => {
        const users = await userModel_1.User.find({ role: "user" }, { email: 1, isActive: 1 })
            .skip(startIndex)
            .limit(limit);
        const totalDocuments = await userModel_1.User.countDocuments();
        return { users, totalDocuments };
    };
    const modifyUserAccess = async (userId) => {
        const user = await userModel_1.User.findById(userId).select("-password");
        if (user) {
            user.isActive = !user.isActive;
            await user.save();
        }
        return user;
    };
    const updateUserPassword = async (email, newPassword) => {
        const updatedUser = await userModel_1.User.findOneAndUpdate({ email }, { password: newPassword }, { new: true });
        return;
    };
    const removeProfilePicUrl = async (userId) => {
        const updatedUser = await userModel_1.User.findOneAndUpdate({ _id: userId }, { imageUrl: "" }, { new: true });
        return updatedUser;
    };
    const followUser = async (userId, userToFollowId) => {
        const userToFollow = await userModel_1.User.findById(userToFollowId);
        if (!userToFollow) {
            throw new appError_1.default("userToFollow not found", httpStatusCodes_1.HttpStatusCodes.NOT_FOUND);
        }
        await Promise.all([
            userModel_1.User.findByIdAndUpdate(userId, {
                $addToSet: { following: userToFollow._id },
            }),
            userModel_1.User.findByIdAndUpdate(userToFollow, {
                $addToSet: { followers: userId },
            }),
        ]);
        return userToFollow.userName;
    };
    const unFollowUser = async (userId, userToUnFollowId) => {
        const userToUnFollow = await userModel_1.User.findById(userToUnFollowId);
        if (!userToUnFollow) {
            throw new appError_1.default("userToFollow", httpStatusCodes_1.HttpStatusCodes.NOT_FOUND);
        }
        await Promise.all([
            userModel_1.User.findByIdAndUpdate(userId, {
                $pull: { following: userToUnFollow._id },
            }),
            userModel_1.User.findByIdAndUpdate(userToUnFollow, {
                $pull: { followers: userId },
            }),
        ]);
        return;
    };
    const getSuggestedUsers = async (userId) => {
        const user = await userModel_1.User.findById(userId);
        if (!user) {
            throw new appError_1.default("invalid user id no user found to get suggested users", httpStatusCodes_1.HttpStatusCodes.BAD_REQUEST);
        }
        const followers = user.followers;
        const excludedIds = [...followers, new mongoose_1.default.Types.ObjectId(userId)];
        const suggestedUsers = await userModel_1.User.find({ _id: { $nin: excludedIds } }, { userName: 1, imageUrl: 1 })
            .sort({ createdAt: -1 })
            .limit(10);
        return suggestedUsers;
    };
    const getFollowersById = async (userId) => {
        const followerUsers = await userModel_1.User.aggregate([
            {
                $match: { _id: new ObjectId(userId) },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "followers",
                    foreignField: "_id",
                    as: "followers",
                },
            },
            { $unwind: "$followers" },
            {
                $project: {
                    "followers.imageUrl": 1,
                    "followers.userName": 1,
                    "followers.createdAt": 1,
                    "followers._id": 1,
                },
            },
        ]);
        return followerUsers;
    };
    const getFollowingById = async (userId) => {
        const followingUser = await userModel_1.User.aggregate([
            {
                $match: { _id: new ObjectId(userId) },
            },
            {
                $lookup: {
                    from: "users",
                    foreignField: "_id",
                    localField: "following",
                    as: "following",
                },
            },
            { $unwind: "$following" },
            {
                $project: {
                    "following.imageUrl": 1,
                    "following.userName": 1,
                    "following.createdAt": 1,
                    "following.firstName": 1,
                    "following.lastName": 1,
                    "following._id": 1,
                },
            },
        ]);
        return followingUser;
    };
    const searchUser = async (query, userId) => {
        const regex = new RegExp(query, "i");
        const results = await userModel_1.User.find({
            role: "user",
            $and: [
                { _id: { $ne: userId } },
                {
                    $or: [
                        { firstName: { $regex: regex } },
                        { lastName: { $regex: regex } },
                        { userName: { $regex: regex } },
                    ],
                },
            ],
        }, {
            firstName: 1,
            lastName: 1,
            userName: 1,
            imageUrl: 1,
        });
        return results;
    };
    const getNumberOfUsers = async () => {
        const numberOfUsers = await userModel_1.User.aggregate([
            {
                $count: "numberOfUsers",
            },
        ]);
        return numberOfUsers[0];
    };
    return {
        addUser,
        getUserByEmail,
        addOtp,
        otpByEmail,
        getUserByUserName,
        getUserById,
        getUserWithOutPass,
        updateUserProfile,
        updateUserImage,
        getAllUsers,
        modifyUserAccess,
        updateUserPassword,
        removeProfilePicUrl,
        followUser,
        unFollowUser,
        getSuggestedUsers,
        getNumOfFollowById,
        getFollowersById,
        getFollowingById,
        searchUser,
        getNumberOfUsers,
    };
};
exports.userRepositoryMongoDb = userRepositoryMongoDb;
