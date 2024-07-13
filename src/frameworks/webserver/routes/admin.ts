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
import { postReportDbRepository } from "../../../application/repositories/postReportRepository";
import { postReportRepositoryMongoDb } from "../../database/mongodb/repositories/postReportRepositoryMongoDb";
const adminRouter = () => {
  const router = express.Router();
  const controller = adminController(
    userDbRepository,
    userRepositoryMongoDb,
    productDbRepository,
    productRepositoryMongoDb,
    adminBidRequestDb,
    adminBidRequestMongoDb,
    bidDbRepository,
    bidRepositoryMongoDb,
    postReportDbRepository,
    postReportRepositoryMongoDb
  );

  router.get("/get-all-users/:page/:limit", controller.handleGetUsers);
  router.get("/block-user/:userId", controller.handleModifyUserAccess);
  router.get("/get-user-profile/:userId", controller.getUserProfileDetails);
  router.get("/get-user-posts/:userId", controller.getUserPosts);
  router.get("/get-user-post-details/:postId", controller.getUserPostDetails);
  router.get("/get-bid-requests", controller.getBidRequests);
  router.patch("/accept-bid/:bidProductId", controller.acceptBidRequest);
  router.get("/get-post-reports", controller.getPostReports);
  router.patch("/block-post/:productId",controller.adminBlockPost)

  return router;
};

export default adminRouter;
