import User from "../models/userModel";

import Otp from "../models/otpSchema";

import { UserEntityType } from "../../../../entities/user";
import { UserInterface } from "../../../../types/userInterface";
import { OtpEntityType } from "../../../../entities/otp";
import { CreateUserInterface } from "../../../../types/userInterface";
import AppError from "../../../../utils/appError";
import { HttpStatusCodes } from "../../../../types/httpStatusCodes";
// import { Document } from 'mongoose';
// interface UserDocument extends UserInterface, Document {}

export const userRepositoryMongoDb = () => {
  const getUserByEmail = async (email: string) => {
    const user: CreateUserInterface | null = await User.findOne({ email });
    return user;
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
    console.log("user name is ", userName);

    const user = await User.findOne({ userName });
    console.log("user in mongo ", user);

    return user;
  };

  const getUserById = async (userId: string) => {
    const user = await User.findById(userId);
    return user;
  };

  const getUserWithOutPass = async (userId: string) => {
    const user = await User.findById(userId).select("-password");
    return user;
  };
  const updateUserProfile = async (userData: UserInterface, userId: string) => {
    console.log("inside mongog update user profile ", userData, userId);
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
    console.log("users in mongo ", users);

    const totalDocuments = await User.countDocuments();

    return { users, totalDocuments };
  };

  const modifyUserAccess = async (userId: string) => {
    const user = await User.findById(userId).select("-password");
    if (user) {
      user.isActive = !user.isActive;
      await user.save();
    }
    console.log("user in mongo modifyUserAccess", user);

    return user;
  };

  const updateUserPassword = async (email: string, newPassword: string) => {
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { password: newPassword },
      { new: true }
    );

    console.log("updated password and thee user is ", updatedUser);

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

    Promise.all([
      User.findByIdAndUpdate(userId, {
        $addToSet: { following: userToFollow._id },
      }),
      User.findByIdAndUpdate(userToFollow, {
        $addToSet: { followers: userId },
      }),
    ]).then(() => {
      return;
    });
  };

  const unFollowUser = async (userId: string, userToUnFollowId: string) => {
    const userToUnFollow = await User.findById(userToUnFollowId);

    if (!userToUnFollow) {
      throw new AppError("userToFollow", HttpStatusCodes.NOT_FOUND);
    }

    Promise.all([
      User.findByIdAndUpdate(userId, {
        $pull: { following: userToUnFollow._id },
      }),
      User.findByIdAndUpdate(userToUnFollow, {
        $pull: { followers: userId },
      }),
    ]).then(() => {
      return;
    });
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
  };
};

export type UserRepositoryMongoDb = typeof userRepositoryMongoDb;
