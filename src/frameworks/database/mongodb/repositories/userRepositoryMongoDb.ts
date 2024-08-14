import { User } from "../models/userModel";
import Otp from "../models/otpSchema";
import { UserEntityType } from "../../../../entities/user";
import { UserInterface } from "../../../../types/userInterface";
import { OtpEntityType } from "../../../../entities/otp";
import AppError from "../../../../utils/appError";
import { HttpStatusCodes } from "../../../../types/httpStatusCodes";
import mongoose from "mongoose";
const { ObjectId } = mongoose.Types;

export const userRepositoryMongoDb = () => {
  const getUserByEmail = async (email: string) => {
    const userData = await User.aggregate([
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

  const getNumOfFollowById = async (userId: string) => {
    const numOfFollow = await User.aggregate([
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

  const addUser = async (user: UserEntityType) => {
    const newUser: any = new User({
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

  const addOtp = async (otpData: OtpEntityType) => {
    const newOtp: any = new Otp({
      email: otpData.getEmail(),
      otp: otpData.getOtp(),
    });
    await newOtp.save();
  };

  const otpByEmail = async (email: string) => {
    const otp = await Otp.findOne({ email }).sort({ createdAt: -1 }).limit(1);
    return otp;
  };

  const getUserByUserName = async (userName: string) => {
    const user = await User.findOne({ userName });

    return user;
  };

  const getUserById = async (userId: string) => {
    const userData = await User.aggregate([
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

  const getUserWithOutPass = async (userId: string) => {
    const user = await User.findById(userId).select("-password");
    return user;
  };
  const updateUserProfile = async (userData: UserInterface, userId: string) => {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: userData },
      { new: true, runValidators: true }
    );

    return updatedUser;
  };

  const updateUserImage = async (imageUrl: string, userId: string) => {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { imageUrl } },
      { new: true, runValidators: true }
    );
    return updatedUser;
  };

  const getAllUsers = async (startIndex: number, limit: number) => {
    const users = await User.find({ role: "user" }, { email: 1, isActive: 1 })
      .skip(startIndex)
      .limit(limit);

    const totalDocuments = await User.countDocuments();

    return { users, totalDocuments };
  };

  const modifyUserAccess = async (userId: string) => {
    const user = await User.findById(userId).select("-password");
    if (user) {
      user.isActive = !user.isActive;
      await user.save();
    }

    return user;
  };

  const updateUserPassword = async (email: string, newPassword: string) => {
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { password: newPassword },
      { new: true }
    );

    return;
  };

  const removeProfilePicUrl = async (userId: string) => {
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { imageUrl: "" },
      { new: true }
    );

    return updatedUser;
  };

  const followUser = async (userId: string, userToFollowId: string) => {
    const userToFollow = await User.findById(userToFollowId);

    if (!userToFollow) {
      throw new AppError("userToFollow not found", HttpStatusCodes.NOT_FOUND);
    }

    await Promise.all([
      User.findByIdAndUpdate(userId, {
        $addToSet: { following: userToFollow._id },
      }),
      User.findByIdAndUpdate(userToFollow, {
        $addToSet: { followers: userId },
      }),
    ]);
    return userToFollow.userName;
  };

  const unFollowUser = async (userId: string, userToUnFollowId: string) => {
    const userToUnFollow = await User.findById(userToUnFollowId);

    if (!userToUnFollow) {
      throw new AppError("userToFollow", HttpStatusCodes.NOT_FOUND);
    }

    await Promise.all([
      User.findByIdAndUpdate(userId, {
        $pull: { following: userToUnFollow._id },
      }),
      User.findByIdAndUpdate(userToUnFollow, {
        $pull: { followers: userId },
      }),
    ]);
    return;
  };

  const getSuggestedUsers = async (userId: string) => {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError(
        "invalid user id no user found to get suggested users",
        HttpStatusCodes.BAD_REQUEST
      );
    }

    const followers = user.followers;
    const excludedIds = [...followers, new mongoose.Types.ObjectId(userId)];

    const suggestedUsers = await User.find(
      { _id: { $nin: excludedIds } },
      { userName: 1, imageUrl: 1 }
    )
      .sort({ createdAt: -1 })
      .limit(10);

    return suggestedUsers;
  };

  const getFollowersById = async (userId: string) => {
    const followerUsers = await User.aggregate([
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
  const getFollowingById = async (userId: string) => {
    const followingUser = await User.aggregate([
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

  const searchUser = async (query: string, userId: string) => {
    const regex = new RegExp(query, "i");

    const results = await User.find(
      {
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
      },
      {
        firstName: 1,
        lastName: 1,
        userName: 1,
        imageUrl: 1,
      }
    );

    return results;
  };

  const getNumberOfUsers = async () => {
    const numberOfUsers = await User.aggregate([
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

export type UserRepositoryMongoDb = typeof userRepositoryMongoDb;
