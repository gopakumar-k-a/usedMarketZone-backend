import { Request, Response } from "express";
import asyncHandlder from "express-async-handler";
import { UserDbInterface } from "../../application/repositories/userDbRepository";
import { UserRepositoryMongoDb } from "../../frameworks/database/mongodb/repositories/userRepositoryMongoDb";
import { HttpStatusCodes } from "../../types/httpStatusCodes";
import { CreateUserInterface, UserInterface } from "../../types/userInterface";
import {
  getUserProfile,
  checkUserNameAvailabilty,
  handleGetSuggestedUsers,
  handleGetNumOfFollowById,
  handleGetFollowersById,
  handleGetFollowingById,
  handleGetKycByUserId,
} from "../../application/user-cases/user/read";
import {
  updateUserProfile,
  updateUserImage,
  updateUserPassword,
  removeProfilePicUrl,
  handleFollowUser,
  handleUnfollowUser,
  handleChangeNotificationStatus,
} from "../../application/user-cases/user/update";
import AppError from "../../utils/appError";
import { AuthService } from "../../frameworks/services/authService";
import { AuthServiceInterface } from "../../application/services/authServiceInterface";
import { ExtendedRequest } from "../../types/extendedRequest";
import { KycRepositoryMongoDB } from "../../frameworks/database/mongodb/repositories/kycRepositoryMongoDB";
import { KycInterface } from "../../application/repositories/kycDbRepository";
import { handleCreateNewKycRequest } from "../../application/user-cases/user/create";
import { ProductDbInterface } from "../../application/repositories/productDbRepository";
import { ProductRepositoryMongoDb } from "../../frameworks/database/mongodb/repositories/productRepositoryMongoDb";
import { handleSearchOnApp } from "../../application/user-cases/search/get";
import { handleGetUserNotifications } from "../../application/user-cases/notifications/get";
import { NotificationInterface } from "../../application/repositories/notificationRepository";
import { NotificationRepositoryMongoDB } from "../../frameworks/database/mongodb/repositories/notificationRepositoryMongoDB";

const userController = (
  userDbRepository: UserDbInterface,
  userDbImpl: UserRepositoryMongoDb,
  authServiceInterface: AuthServiceInterface,
  authService: AuthService,
  kycDbRepository: KycInterface,
  kycRepositoryImpl: KycRepositoryMongoDB,
  productDbRepository: ProductDbInterface,
  productRepositoryImpl: ProductRepositoryMongoDb,
  notificationRepository: NotificationInterface,
  notificationImpl: NotificationRepositoryMongoDB
) => {
  const dbRepositoryUser = userDbRepository(userDbImpl());
  const userService = authServiceInterface(authService());
  const dbRepositoryKyc = kycDbRepository(kycRepositoryImpl());
  const dbRepositoryProduct = productDbRepository(productRepositoryImpl());
  const dbNotification = notificationRepository(notificationImpl());

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
      const { userName, userId } = req.params;

      const userAvailablity = await checkUserNameAvailabilty(
        userName,
        userId,
        dbRepositoryUser
      );

      let message;

      if (userAvailablity) {
        message = "user name is available";
      } else {
        message = "user name is not available";
      }

      res.status(HttpStatusCodes.OK).json({
        success: true,
        message,
        userAvailablity,
      });
    }
  );

  const handleProfileUpdate = asyncHandlder(
    async (req: Request, res: Response) => {
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
      const updatedUser = await removeProfilePicUrl(userId, dbRepositoryUser);

      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: "user profile image removed successfully",
        updatedUser,
      });
    }
  );

  const suggestedUsers = asyncHandlder(
    async (req: ExtendedRequest, res: Response) => {
      const { _id } = req.user as CreateUserInterface;

      const suggestedUsers = await handleGetSuggestedUsers(
        _id,
        dbRepositoryUser
      );

      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: "Suggested User Data Retrived successfully",
        suggestedUsers,
      });
    }
  );

  const followUser = asyncHandlder(
    async (req: ExtendedRequest, res: Response) => {
      const { _id } = req.user as CreateUserInterface;
      const { followUserId } = req.params;
      await handleFollowUser(
        _id,
        followUserId,
        dbRepositoryUser,
        dbNotification
      );

      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: "Added User To Follow List",
      });
    }
  );

  const unFollowUser = asyncHandlder(
    async (req: ExtendedRequest, res: Response) => {
      const { _id } = req.user as CreateUserInterface;
      const { unFollowUserId } = req.params;
      await handleUnfollowUser(
        _id,
        unFollowUserId,
        dbRepositoryUser,
        dbNotification
      );

      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: "Added User To Follow List",
      });
    }
  );

  const getNumberOfFollowById = asyncHandlder(
    async (req: ExtendedRequest, res: Response) => {
      const { userId } = req.params;

      const numOfFollow = await handleGetNumOfFollowById(
        userId,
        dbRepositoryUser
      );
      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: "number of followers retrived successfully",
        numOfFollow,
      });
    }
  );

  const getFollowers = asyncHandlder(
    async (req: ExtendedRequest, res: Response) => {
      const { _id } = req.user as CreateUserInterface;

      const followerUsers = await handleGetFollowersById(_id, dbRepositoryUser);

      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: "followers fetched successfully",
        followerUsers,
      });
    }
  );
  const getFollowing = asyncHandlder(
    async (req: ExtendedRequest, res: Response) => {
      const { _id } = req.user as CreateUserInterface;

      const followingUsers = await handleGetFollowingById(
        _id,
        dbRepositoryUser
      );

      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: "followers fetched successfully",
        followingUsers,
      });
    }
  );

  const addNewKycRequest = asyncHandlder(
    async (req: ExtendedRequest, res: Response) => {
      const { _id: userId } = req.user as CreateUserInterface;

      await handleCreateNewKycRequest(userId, req.body, dbRepositoryKyc);

      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: "Kyc Request Added Successfully",
      });
    }
  );

  const searchOnApp = asyncHandlder(
    async (req: ExtendedRequest, res: Response) => {
      const { _id: userId } = req.user as CreateUserInterface;
      const { query, filter, subFilter } = req.query as {
        query: string;
        filter: string;
        subFilter: string;
      };

      const results = await handleSearchOnApp(
        dbRepositoryUser,
        dbRepositoryProduct,
        userId,
        query,
        filter,
        subFilter
      );

      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: "search Results retrived successfully",
        results,
      });
    }
  );

  const getUserNotifications = asyncHandlder(
    async (req: ExtendedRequest, res: Response) => {
      const { _id: userId } = req.user as CreateUserInterface;

      const userNotifications = await handleGetUserNotifications(
        userId,
        dbNotification
      );

      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: "notifications retrived successfully",
        userNotifications,
      });
    }
  );

  const changeNotificationReadStatus = asyncHandlder(
    async (req: ExtendedRequest, res: Response) => {
      const { _id: userId } = req.user as CreateUserInterface;

      await handleChangeNotificationStatus(userId, dbNotification);

      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: "unread notification status changed to read successfully",
      });
    }
  );

  const getMyKycData = asyncHandlder(
    async (req: ExtendedRequest, res: Response) => {
      const { _id: userId } = req.user as CreateUserInterface;

      const kycData = await handleGetKycByUserId(userId, dbRepositoryKyc);

      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: "kyc data retrived successfully",
        kycData,
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
    followUser,
    unFollowUser,
    suggestedUsers,
    getNumberOfFollowById,
    getFollowers,
    getFollowing,
    addNewKycRequest,
    searchOnApp,
    getUserNotifications,
    changeNotificationReadStatus,
    getMyKycData,
  };
};

export default userController;
