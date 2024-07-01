import { UserRepositoryMongoDb } from "../../frameworks/database/mongodb/repositories/userRepositoryMongoDb";

import { UserEntityType } from "../../entities/user";

import { OtpEntityType } from "../../entities/otp";
import { UserInterface } from "../../types/userInterface";

export const userDbRepository = (
  repository: ReturnType<UserRepositoryMongoDb>
) => {
  const getUserByEmail = async (email: string) =>
    await repository.getUserByEmail(email);
  const addUser = async (user: UserEntityType) =>
    await repository.addUser(user);
  const addOtp = async (otpData: OtpEntityType) =>
    await repository.addOtp(otpData);
  const otpByEmail = async (email: string) =>
    await repository.otpByEmail(email);
  const getUserByUserName = async (userName: string) =>
    await repository.getUserByUserName(userName);
  const getUserById = async (userId: string) =>
    await repository.getUserById(userId);
  const getUserWithOutPass = async (userId: string) =>
    await repository.getUserWithOutPass(userId);
  const updateUserProfile = async (userData: UserInterface, userId: string) =>
    await repository.updateUserProfile(userData, userId);
  const updateUserImage = async (imageUrl: string, userId: string) =>
    await repository.updateUserImage(imageUrl, userId);
  const getAllUsers = async (startIndex: number, limit: number) =>
    await repository.getAllUsers(startIndex, limit);
  const modifyUserAccess = async (userId: string) =>
    await repository.modifyUserAccess(userId);
  const updateUserPassword = async (email: string, newPassword: string) =>
    await repository.updateUserPassword(email, newPassword);

  const removeProfilePicUrl = async (userId: string) =>
    await repository.removeProfilePicUrl(userId);
  const followUser = async (userId: string, userToFollowId: string) =>
    await repository.followUser(userId, userToFollowId);
  const unFollowUser = async (userId: string, userToUnFollowId: string) =>
    await repository.unFollowUser(userId, userToUnFollowId);
  return {
    addUser,
    getUserByEmail,
    addOtp,
    otpByEmail,
    getUserByUserName,
    getUserById,
    updateUserProfile,
    updateUserImage,
    getAllUsers,
    modifyUserAccess,
    updateUserPassword,
    removeProfilePicUrl,
    getUserWithOutPass,
    followUser,
    unFollowUser,
  };
};

export type UserDbInterface = typeof userDbRepository;
