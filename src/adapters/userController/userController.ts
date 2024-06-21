import { Request, Response } from "express";
import asyncHandlder from "express-async-handler";
import { UserDbInterface } from "../../application/repositories/userDbRepository";
import { UserRepositoryMongoDb } from "../../frameworks/database/mongodb/repositories/userRepositoryMongoDb";
import { HttpStatusCodes } from "../../types/httpStatusCodes";
import { UserInterface } from "../../types/userInterface";
import {
  getUserProfile,
  checkUserNameAvailabilty,
} from "../../application/user-cases/user/read";
import {
  updateUserProfile,
  updateUserImage,
  updateUserPassword,
  removeProfilePicUrl,
} from "../../application/user-cases/user/update";
import AppError from "../../utils/appError";
import { AuthService } from "../../frameworks/services/authService";
import { AuthServiceInterface } from "../../application/services/authServiceInterface";

const userController = (
  userDbRepository: UserDbInterface,
  userDbImpl: UserRepositoryMongoDb,
  authServiceInterface: AuthServiceInterface,
  authService: AuthService
) => {
  const dbRepositoryUser = userDbRepository(userDbImpl());
  const userService = authServiceInterface(authService());

  const handleGetUserProfile = asyncHandlder(
    async (req: Request, res: Response) => {
      const userId: any = req.params.userId;
      const userData = await getUserProfile(userId, dbRepositoryUser);

      res.status(HttpStatusCodes.OK).json({
        status: "success",
        message: "User Details has been feteched",
        userData,
      });
    }
  );

  const handleUserNameCheck = asyncHandlder(
    async (req: Request, res: Response) => {
      // const userName = req.params.userName;
      const { userName, userId } = req.params;
      console.log("userName,userId ", userName, userId);

      const userAvailablity = await checkUserNameAvailabilty(
        userName,
        userId,
        dbRepositoryUser
      );

      console.log("user name is ", userName);
      let message;
      console.log("user availability ", userAvailablity);

      if (userAvailablity) {
        message = "user name is available";
      } else {
        message = "user name is not available";
      }

      console.log("message is ", message);

      res.status(HttpStatusCodes.OK).json({
        success: true,
        message,
        userAvailablity,
      });
    }
  );

  const handleProfileUpdate = asyncHandlder(
    async (req: Request, res: Response) => {
      console.log("req body in handleProfileUpdate ", req.body);
      console.log("params in handleProfileUpdate ", req.params.userId);
      const { userId } = req.params;
      const userData: UserInterface = req.body;
      const updatedUser = await updateUserProfile(
        userData,
        userId,
        dbRepositoryUser
      );
      res.status(HttpStatusCodes.OK).json({
        status: true,
        message: "user profile updated successfully",
        updatedUser,
      });
    }
  );

  const handleProfileImageUpdate = asyncHandlder(
    async (req: Request, res: Response) => {
      const { userId } = req.params;
      const { imageUrl } = req.body;

      console.log("userId imageUrl", userId, imageUrl);

      const updatedUser = await updateUserImage(
        imageUrl,
        userId,
        dbRepositoryUser
      );

      res.status(HttpStatusCodes.OK).json({
        status: true,
        message: "udpated user profile ",
        updatedUser,
      });
    }
  );

  const handleUserPasswordUpdate = asyncHandlder(async (req, res) => {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const { userId } = req.params;

    if (!userId) {
      throw new AppError(
        "Missing required parameter: userId",
        HttpStatusCodes.UNAUTHORIZED
      );
    }

    if (!currentPassword || !newPassword || !confirmPassword) {
      throw new AppError(
        "All fields (current password, new password, confirm password) are required",
        HttpStatusCodes.UNAUTHORIZED
      );
    }

    if (newPassword !== confirmPassword) {
      throw new AppError(
        "New password and confirm password do not match",
        HttpStatusCodes.UNAUTHORIZED
      );
    }

    await updateUserPassword(
      currentPassword,
      newPassword,
      userId,
      dbRepositoryUser,
      userService
    );

    res
      .status(HttpStatusCodes.OK)
      .json({ success: true, message: "Password updated successfully!" });
  });

  const handleProfilePicRemove = asyncHandlder(
    async (req: Request, res: Response) => {
      const { userId } = req.params;
     const updatedUser= await removeProfilePicUrl(userId, dbRepositoryUser);

      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: "user profile image removed successfully",
        updatedUser
      });
    }
  );

  return {
    handleGetUserProfile,
    handleUserNameCheck,
    handleProfileUpdate,
    handleProfileImageUpdate,
    handleUserPasswordUpdate,
    handleProfilePicRemove,
  };
};

export default userController;
