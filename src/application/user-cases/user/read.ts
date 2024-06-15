import { HttpStatusCodes } from "../../../types/httpStatusCodes";
import AppError from "../../../utils/appError";
import { UserDbInterface } from "../../repositories/userDbRepository";

export function removeSensitiveFields(object: any) {
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
  const {users,totalDocuments} = await userRepository.getAllUsers(startIndex, limit);
  return {users,totalDocuments};
};
