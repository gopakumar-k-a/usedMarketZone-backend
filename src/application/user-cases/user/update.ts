import { HttpStatusCodes } from "../../../types/httpStatusCodes";
import AppError from "../../../utils/appError";
import { UserDbInterface } from "../../repositories/userDbRepository";
import { AuthServiceInterface } from "../../services/authServiceInterface";
import { UserInterface } from "../../../types/userInterface";
import { removeSensitiveFields } from "./read";
import { NotificationInterface } from "../../repositories/notificationRepository";
import { io } from "../../../app";
import { getRecieverSocketId } from "../../../frameworks/webSocket/socket";
import { createNotificationEntity } from "../../../entities/createNotificationEntity";
import { KycInterface } from "../../repositories/kycDbRepository";
import { Types } from "mongoose";

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
  dbRepositoryUser: ReturnType<UserDbInterface>,
  dbRepositoryNotification: ReturnType<NotificationInterface>
) => {
  const userToFollowUserName = await dbRepositoryUser.followUser(
    userId,
    userToFollowId
  );
  console.log(`sender ${userId}`);
  console.log(`reciever ${userToFollowId}`);

  const recieverSocketId = getRecieverSocketId(userToFollowId);
  console.log("reciever socket id ", recieverSocketId);

  const newNotificationEntity = createNotificationEntity(
    "follow",
    userId,
    userToFollowId,
    "unread",
    undefined,
    undefined,
    undefined,
    undefined,
    undefined
  );

  const newNotification = await dbRepositoryNotification.createNotification(
    newNotificationEntity
  );
  if (recieverSocketId && userToFollowUserName) {
    const notificationData = {
      title: "You have a new message",
      //@ts-ignore
      description: `${userToFollowUserName} started following you`,
      userToFollowId,
      //@ts-ignore
      // additionalInfo: messageId.message,
      notificationType: "follow",
      newNotification,
    };

    console.log("new notification data ", notificationData);

    io.to(recieverSocketId).emit("notification", notificationData);
  }

  return;
};

export const handleUnfollowUser = async (
  userId: string,
  userToUnFollowId: string,
  dbRepositoryUser: ReturnType<UserDbInterface>,
  dbRepositoryNotification: ReturnType<NotificationInterface>
) => {
  await Promise.all([
    dbRepositoryUser.unFollowUser(userId, userToUnFollowId),
    dbRepositoryNotification.removeFollowNotification(userId, userToUnFollowId),
  ]);

  return;
};

export const handleChangeNotificationStatus = async (
  userId: string,
  dbRepositoryNotification: ReturnType<NotificationInterface>
) => {
  await dbRepositoryNotification.changeUnreadStatusNotification(userId);

  return;
};

export const handleKycRequestAdmin = async (
  kycId: string,
  type: "accept" | "reject",

  kycRepository: ReturnType<KycInterface>
) => {
  const updatedKyc = await kycRepository.handleKycRequestAdmin(
    new Types.ObjectId(kycId),
    type
  );

  return updatedKyc;
};
