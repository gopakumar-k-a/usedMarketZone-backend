import express from "express";
import { userDbRepository } from "../../../application/repositories/userDbRepository";
import { userRepositoryMongoDb } from "../../database/mongodb/repositories/userRepositoryMongoDb";
import { authService } from "../../services/authService";
import { authServiceInterface } from "../../../application/services/authServiceInterface";
import userController from "../../../adapters/userController/userController";
import { kycDbRepository } from "../../../application/repositories/kycDbRepository";
import { kycRepositoryMongoDB } from "../../database/mongodb/repositories/kycRepositoryMongoDB";
import { productDbRepository } from "../../../application/repositories/productDbRepository";
import { productRepositoryMongoDb } from "../../database/mongodb/repositories/productRepositoryMongoDb";
import { notificationRepository } from "../../../application/repositories/notificationRepository";
import { notificationRepositoryMongoDB } from "../../database/mongodb/repositories/notificationRepositoryMongoDB";

const userRouter = () => {
  const router = express.Router();

  const controller = userController(
    userDbRepository,
    userRepositoryMongoDb,
    authServiceInterface,
    authService,
    kycDbRepository,
    kycRepositoryMongoDB,
    productDbRepository,
    productRepositoryMongoDb,
    notificationRepository,
    notificationRepositoryMongoDB
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
  router.get("/suggested-users", controller.suggestedUsers);

  router.patch("/follow-user/:followUserId", controller.followUser);
  router.patch("/un-follow-user/:unFollowUserId", controller.unFollowUser);
  router.get("/num-of-follow/:userId", controller.getNumberOfFollowById);
  router.get("/followers", controller.getFollowers);
  router.get("/following", controller.getFollowing);
  router.post("/kyc-request", controller.addNewKycRequest);
  router.get("/search", controller.searchOnApp);
  router.get("/get-notifications", controller.getUserNotifications);
  router.patch(
    "/change-notification-status",
    controller.changeNotificationReadStatus
  );
  router.get("/my-kyc", controller.getMyKycData);
  // router.get("my-posts",controller)

  return router;
};

export default userRouter;
