import express from "express";
import adminController from "../../../adapters/adminController/adminController";
import { userDbRepository } from "../../../application/repositories/userDbRepository";
import { userRepositoryMongoDb } from "../../../frameworks/database/mongodb/repositories/userRepositoryMongoDb";
import { productDbRepository } from "../../../application/repositories/productDbRepository";
import { productRepositoryMongoDb } from "../../database/mongodb/repositories/productRepositoryMongoDb";
import { adminBidRequestDb } from "../../../application/repositories/adminBidRequestDbRepository";
import { adminBidRequestMongoDb } from "../../database/mongodb/repositories/adminBidRequestRepositoryMongoDb";
import { bidDbRepository } from "../../../application/repositories/bidRepository";
import { bidRepositoryMongoDb } from "../../database/mongodb/repositories/bidRepositoryMongoDb";
const adminRouter = () => {
  const router = express.Router();
  const controller = adminController(userDbRepository, userRepositoryMongoDb,productDbRepository,productRepositoryMongoDb,adminBidRequestDb,adminBidRequestMongoDb,bidDbRepository,bidRepositoryMongoDb);

  router.get("/get-all-users/:page/:limit", controller.handleGetUsers);
  router.get("/block-user/:userId", controller.handleModifyUserAccess);
  router.get("/get-user-profile/:userId",controller.getUserProfileDetails)
  router.get("/get-user-posts/:userId",controller.getUserPosts)
  router.get("/get-user-post-details/:postId",controller.getUserPostDetails)
  router.get("/get-bid-requests",controller.getBidRequests)
  router.patch("/accept-bid/:bidProductId",controller.acceptBidRequest)


  return router;
};

export default adminRouter;
