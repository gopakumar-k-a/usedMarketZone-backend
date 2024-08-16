"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = __importDefault(require("../../../adapters/adminController/adminController"));
const userDbRepository_1 = require("../../../application/repositories/userDbRepository");
const userRepositoryMongoDb_1 = require("../../../frameworks/database/mongodb/repositories/userRepositoryMongoDb");
const productDbRepository_1 = require("../../../application/repositories/productDbRepository");
const productRepositoryMongoDb_1 = require("../../database/mongodb/repositories/productRepositoryMongoDb");
const adminBidRequestDbRepository_1 = require("../../../application/repositories/adminBidRequestDbRepository");
const adminBidRequestRepositoryMongoDb_1 = require("../../database/mongodb/repositories/adminBidRequestRepositoryMongoDb");
const bidRepository_1 = require("../../../application/repositories/bidRepository");
const bidRepositoryMongoDb_1 = require("../../database/mongodb/repositories/bidRepositoryMongoDb");
const postReportRepository_1 = require("../../../application/repositories/postReportRepository");
const postReportRepositoryMongoDb_1 = require("../../database/mongodb/repositories/postReportRepositoryMongoDb");
const bidHistoryRepository_1 = require("../../../application/repositories/bidHistoryRepository");
const bidHistoryRepositoryMongoDb_1 = require("../../database/mongodb/repositories/bidHistoryRepositoryMongoDb");
const kycDbRepository_1 = require("../../../application/repositories/kycDbRepository");
const kycRepositoryMongoDB_1 = require("../../database/mongodb/repositories/kycRepositoryMongoDB");
const BidServiceInterface_1 = require("../../../application/services/BidServiceInterface");
const bidService_1 = require("../../services/bidService");
const scheduleServiceInterface_1 = require("../../../application/services/scheduleServiceInterface");
const scheduleService_1 = require("../../scheduler/scheduleService");
const transactionRepository_1 = require("../../../application/repositories/transactionRepository");
const transactionRepositoryMongoDb_1 = require("../../database/mongodb/repositories/transactionRepositoryMongoDb");
const walletRepository_1 = require("../../../application/repositories/walletRepository");
const walletRepositoryMongoDb_1 = require("../../database/mongodb/repositories/walletRepositoryMongoDb");
const adminRouter = () => {
    const router = express_1.default.Router();
    const controller = (0, adminController_1.default)(userDbRepository_1.userDbRepository, userRepositoryMongoDb_1.userRepositoryMongoDb, productDbRepository_1.productDbRepository, productRepositoryMongoDb_1.productRepositoryMongoDb, adminBidRequestDbRepository_1.adminBidRequestDb, adminBidRequestRepositoryMongoDb_1.adminBidRequestMongoDb, bidRepository_1.bidDbRepository, bidRepositoryMongoDb_1.bidRepositoryMongoDb, postReportRepository_1.postReportDbRepository, postReportRepositoryMongoDb_1.postReportRepositoryMongoDb, bidHistoryRepository_1.bidHistoryRepository, bidHistoryRepositoryMongoDb_1.bidHistoryRepositoryMongoDb, kycDbRepository_1.kycDbRepository, kycRepositoryMongoDB_1.kycRepositoryMongoDB, BidServiceInterface_1.bidServiceInterface, bidService_1.bidService, scheduleServiceInterface_1.scheduleServiceInterface, scheduleService_1.scheduleService, transactionRepository_1.transactionRepository, transactionRepositoryMongoDb_1.transactionRepositoryMongoDb, walletRepository_1.walletRepository, walletRepositoryMongoDb_1.walletRepositoryMongoDb);
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
    router.get("/get-bid-transactions", controller.getTransactionDetailsOfBidAdmin);
    router.get("/get-dashboard-transactions", controller.getTransactionStatistics);
    router.patch("/admin-recieved-bid-product/:trId", controller.adminRecievedTransactionChangeStatus);
    router.patch("/admin-send-bid-product-winner/:trId", controller.shipProductToWinner);
    router.patch("/mark-product-delivered/:trId", controller.productDeliveredToWinner);
    return router;
};
exports.default = adminRouter;