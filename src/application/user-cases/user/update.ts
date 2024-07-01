import { HttpStatusCodes } from "../../../types/httpStatusCodes";
import AppError from "../../../utils/appError";
import { UserDbInterface } from "../../repositories/userDbRepository";
import { AuthServiceInterface } from "../../services/authServiceInterface";
import { UserInterface } from "../../../types/userInterface";
import { removeSensitiveFields } from "./read";

export const updateUserProfile = async (
  userData: UserInterface,
  userId: string,
  userRepository: ReturnType<UserDbInterface>
) => {
  if (!userData) {
    throw new AppError(
      "try again something went wrong",
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  const updatedUserObj = await userRepository.updateUserProfile(
    userData,
    userId
  );
  const formatedUserData = await removeSensitiveFields(updatedUserObj);

  console.log(
    "user datat in inside formatedUserData use case ",
    formatedUserData
  );
  return formatedUserData;
};

export const updateUserImage = async (
  imageUrl: string,
  userId: string,
  userRepository: ReturnType<UserDbInterface>
) => {
  const updatedUserObj = await userRepository.updateUserImage(imageUrl, userId);
  const formatedUserData = await removeSensitiveFields(updatedUserObj);

  return formatedUserData;
};

export const modifyUserAccess = async (
  userId: string,
  userRepository: ReturnType<UserDbInterface>
) => {
  const updatedUser = await userRepository.modifyUserAccess(userId);

  if (!updatedUser) {
    throw new AppError("user not found ", HttpStatusCodes.NOT_FOUND);
  }

  return updatedUser;
};

export const updateUserPassword = async (
  currentPassword: string,
  newPassword: string,
  userId: string,
  dbRepositoryUser: ReturnType<UserDbInterface>,
  userService: ReturnType<AuthServiceInterface>
) => {
  const user = (await dbRepositoryUser.getUserById(
    userId
  )) as UserInterface | null;
  if (!user) {
    throw new AppError(
      "No user found with the provided user ID",
      HttpStatusCodes.NOT_FOUND
    );
  }

  const userPassword = user.password as string;
  const isPasswordValid = await userService.comparePassword(
    currentPassword,
    userPassword
  );

  if (!isPasswordValid) {
    throw new AppError(
      "Current password is incorrect",
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  const hashedPassword = await userService.encryptPassword(newPassword);
  console.log("hashedpassword ", hashedPassword);

  const userEmail = user.email;

  await dbRepositoryUser.updateUserPassword(userEmail, hashedPassword);

  return;
};

export const removeProfilePicUrl = async (
  userId: string,
  dbRepositoryUser: ReturnType<UserDbInterface>
) => {
  const updatedUser = await dbRepositoryUser.removeProfilePicUrl(userId);
  if (!updatedUser) {
    throw new AppError("invalid User ", HttpStatusCodes.NOT_FOUND);
  }
  const removedSensitiveFields = await removeSensitiveFields(updatedUser);
  return removedSensitiveFields;
};

export const handleFollowUser = async (
  userId: string,
  userToFollowId: string,
  dbRepositoryUser: ReturnType<UserDbInterface>
) => {
  await dbRepositoryUser.followUser(userId, userToFollowId);
  return;
};

export const handleUnfollowUser = async (
  userId: string,
  userToUnFollowId: string,
  dbRepositoryUser: ReturnType<UserDbInterface>
) => {
  await dbRepositoryUser.unFollowUser(userId, userToUnFollowId);
  return;
};


