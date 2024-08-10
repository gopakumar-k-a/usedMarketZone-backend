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
import { bidHistoryRepository } from "../../../application/repositories/bidHistoryRepository";
import { bidHistoryRepositoryMongoDb } from "../../database/mongodb/repositories/bidHistoryRepositoryMongoDb";
import { kycDbRepository } from "../../../application/repositories/kycDbRepository";
import { kycRepositoryMongoDB } from "../../database/mongodb/repositories/kycRepositoryMongoDB";
import { bidServiceInterface } from "../../../application/services/BidServiceInterface";
import { bidService } from "../../services/bidService";
import { scheduleServiceInterface } from "../../../application/services/scheduleServiceInterface";
import { scheduleService } from "../../scheduler/scheduleService";
import { transactionRepository } from "../../../application/repositories/transactionRepository";
import { transactionRepositoryMongoDb } from "../../database/mongodb/repositories/transactionRepositoryMongoDb";
import { walletRepository } from "../../../application/repositories/walletRepository";
import { walletRepositoryMongoDb } from "../../database/mongodb/repositories/walletRepositoryMongoDb";
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
    postReportRepositoryMongoDb,
    bidHistoryRepository,
    bidHistoryRepositoryMongoDb,
    kycDbRepository,
    kycRepositoryMongoDB,
    bidServiceInterface,
    bidService,
    scheduleServiceInterface,
    scheduleService,
    transactionRepository,
    transactionRepositoryMongoDb,
    walletRepository,
    walletRepositoryMongoDb
  );

  router.get("/get-all-users/:page/:limit", controller.handleGetUsers);
  router.get("/block-user/:userId", controller.handleModifyUserAccess);
  router.get("/get-user-profile/:userId", controller.getUserProfileDetails);
  router.get("/get-user-posts/:userId", controller.getUserPosts);
  router.get("/get-user-post-details/:postId", controller.getUserPostDetails);
  router.get("/get-bid-requests", controller.getBidRequests);
  router.patch("/accept-bid/:bidProductId", controller.acceptBidRequest);
  router.get("/get-post-reports", controller.getPostReports);
  router.patch("/block-post/:productId", controller.adminBlockPost);
  router.get("/bid-history/:bidProductId", controller.getBidHistoryOfProduct);
  router.get("/get-kyc-requests", controller.getKycRequests);
  router.patch("/handle-kyc-request/:kycId", controller.changeKycRequestStatus);
  router.get("/all-product-posts", controller.getAllProductPostAdmin);
  router.get("/get-dashboard-statistics", controller.getDashboardStatistics);
  router.get(
    "/get-bid-transactions",
    controller.getTransactionDetailsOfBidAdmin
  );
  router.get(
    "/get-dashboard-transactions",
    controller.getTransactionStatistics
  );

  router.patch(
    "/admin-recieved-bid-product/:trId",
    controller.adminRecievedTransactionChangeStatus
  );

  router.patch(
    "/admin-send-bid-product-winner/:trId",
    controller.shipProductToWinner
  );
  router.patch(
    "/mark-product-delivered/:trId",
    controller.productDeliveredToWinner
  );
  return router;
};

export default adminRouter;
