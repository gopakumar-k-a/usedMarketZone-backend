import { Types } from "mongoose";
import { HttpStatusCodes } from "../../../types/httpStatusCodes";
import AppError from "../../../utils/appError";
import { KycInterface } from "../../repositories/kycDbRepository";
import { ProductDbInterface } from "../../repositories/productDbRepository";
import { UserDbInterface } from "../../repositories/userDbRepository";

export async function removeSensitiveFields(object: any) {
  const {
    _id,
    firstName,
    lastName,
    userName,
    email,
    role,
    createdAt,
    updatedAt,
    imageUrl,
    phone,
    bio,
    isActive,
    followers,
    following,
    numOfFollowers,
    numOfFollowing,
  } = object;

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

export const getUserProfile = async (
  userId: string,
  userRepository: ReturnType<UserDbInterface>
) => {
  if (!userId) {
    throw new AppError(
      "try again something went wrong",
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  const user = await userRepository.getUserById(userId);
  console.log("user ", user);

  const data = removeSensitiveFields(user);

  console.log("data aaaaaaaaaaa ", data);

  return data;
};

export const checkUserNameAvailabilty = async (
  userName: string,
  userId: string,
  userRepository: ReturnType<UserDbInterface>
) => {
  const user = await userRepository.getUserByUserName(userName);
  console.log("user is ,", user);

  console.log("user in the repository  ", user);

  if (user) {
    return false;
  } else {
    return true;
  }
};

export const getAllUsers = async (
  startIndex: number,
  limit: number,
  userRepository: ReturnType<UserDbInterface>
) => {
  const { users, totalDocuments } = await userRepository.getAllUsers(
    startIndex,
    limit
  );
  return { users, totalDocuments };
};

export const handleGetUserPosts = async (
  userId: string,
  productRepository: ReturnType<ProductDbInterface>
) => {
  const userPosts = await productRepository.getUserPosts(userId);
  if (!userPosts) {
    return 0;
  }

  return userPosts;
};

export const handleGetUserPostDetails = async (
  postId: string,
  productRepository: ReturnType<ProductDbInterface>
) => {
  const postDetails = await productRepository.getUserPostDetailsAdmin(postId);

  if (!postDetails) {
    new AppError(
      "No Product Data Found , Check Post Id",
      HttpStatusCodes.BAD_GATEWAY
    );
  }

  return postDetails;
};

export const handleGetSuggestedUsers = async (
  userId: string,
  userRepository: ReturnType<UserDbInterface>
) => {
  const suggestedUsers = await userRepository.getSuggestedUsers(userId);
  return suggestedUsers;
};

export const handleGetNumOfFollowById = async (
  userId: string,
  userRepository: ReturnType<UserDbInterface>
) => {
  const numOfFollow = await userRepository.getNumOfFollowById(userId);

  if (!numOfFollow) {
    throw new AppError(
      "cant find number of follow check user id ",
      HttpStatusCodes.BAD_GATEWAY
    );
  }

  return numOfFollow;
};

export const handleGetFollowersById = async (
  userId: string,
  userRepository: ReturnType<UserDbInterface>
) => {
  const followerUsers = userRepository.getFollowersById(userId);

  return followerUsers;
};
export const handleGetFollowingById = async (
  userId: string,
  userRepository: ReturnType<UserDbInterface>
) => {
  const followingUsers = userRepository.getFollowingById(userId);

  return followingUsers;
};

export const handleGetKycByUserId = async (
  userId: string,
  kycRepository: ReturnType<KycInterface>
) => {
  const kycData = await kycRepository.getKycByUserId(
    new Types.ObjectId(userId)
  );

  return kycData;
};

export const handleGetKycRequestsAdmin = async (
  kycRepository: ReturnType<KycInterface>
) => {
  const kycData = await kycRepository.getKycAdmin();
  return kycData;
};


