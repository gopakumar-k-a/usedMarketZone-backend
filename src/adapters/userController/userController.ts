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
import { updateUserProfile ,
  updateUserImage
} from "../../application/user-cases/user/update";

const userController = (
  userDbRepository: UserDbInterface,
  userRepositoryMongoDb: UserRepositoryMongoDb
) => {
  const dbRepositoryUser = userDbRepository(userRepositoryMongoDb());

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
        status:true,
        message: "user profile updated successfully",
        updatedUser,
      });
    }
  );

  const handleProfileImageUpdate = asyncHandlder(
    async (req: Request, res: Response) => {
      const { userId } = req.params;
      const { imageUrl } = req.body;

      console.log('userId imageUrl',userId,imageUrl);

      const updatedUser=await updateUserImage(imageUrl,userId,dbRepositoryUser)
      

      res.status(HttpStatusCodes.OK).send({
        status:true,
        message:"udpated user profile ",
        updatedUser

      })
    }
  );

  return {
    handleGetUserProfile,
    handleUserNameCheck,
    handleProfileUpdate,
    handleProfileImageUpdate,
  };
};

export default userController;
