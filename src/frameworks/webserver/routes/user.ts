import express from "express";
import { userDbRepository } from "../../../application/repositories/userDbRepository";
import {
  UserRepositoryMongoDb,
  userRepositoryMongoDb,
} from "../../database/mongodb/repositories/userRepositoryMongoDb";
import { authService } from "../../services/authService";
import { authServiceInterface } from "../../../application/services/authServiceInterface";
import userController from "../../../adapters/userController/userController";

const userRouter = () => {
  const router = express.Router();

  const controller = userController(
    userDbRepository,
    userRepositoryMongoDb,
    authServiceInterface,
    authService
  );

  router.route("/profile/:userId").get(controller.handleGetUserProfile);
  router.put("/edit-profile/:userId", controller.handleProfileUpdate);

  router.put(
    "/edit-profile/update-image/:userId",
    controller.handleProfileImageUpdate
  );

  router.put(
    "/edit-profile/update-password/:userId",
    controller.handleUserPasswordUpdate
  );

  router.put(
    "/edit-profile/remove-profile-pic/:userId",
    controller.handleProfilePicRemove
  );

  router.get(
    "/username-check/:userName/:userId",
    controller.handleUserNameCheck
  );

  router.patch("/follow-user/:followUserId",controller.followUser)
  router.patch("/un-follow/:id",controller.unFollowUser)
  // router.get("my-posts",controller)

  return router;
};

export default userRouter;
