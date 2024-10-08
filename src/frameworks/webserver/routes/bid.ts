import express from "express";
import { productDbRepository } from "../../../application/repositories/productDbRepository";
import { productRepositoryMongoDb } from "../../database/mongodb/repositories/productRepositoryMongoDb";
import { bidController } from "../../../adapters/bidController/bidController";
import { adminBidRequestMongoDb } from "../../database/mongodb/repositories/adminBidRequestRepositoryMongoDb";
import { adminBidRequestDb } from "../../../application/repositories/adminBidRequestDbRepository";
import { bidDbRepository } from "../../../application/repositories/bidRepository";
import { bidRepositoryMongoDb } from "../../database/mongodb/repositories/bidRepositoryMongoDb";
import { bidHistoryRepository } from "../../../application/repositories/bidHistoryRepository";
import { bidHistoryRepositoryMongoDb } from "../../database/mongodb/repositories/bidHistoryRepositoryMongoDb";
import { kycDbRepository } from "../../../application/repositories/kycDbRepository";
import { kycRepositoryMongoDB } from "../../database/mongodb/repositories/kycRepositoryMongoDB";
const bidRouter = () => {
  const router = express.Router();
  const controller = bidController(
    productDbRepository,
    productRepositoryMongoDb,
    adminBidRequestDb,
    adminBidRequestMongoDb,
    bidDbRepository,
    bidRepositoryMongoDb,
    bidHistoryRepository,
    bidHistoryRepositoryMongoDb,
    kycDbRepository,
    kycRepositoryMongoDB
  );

  router.post("/post-bid", controller.productBidPost);
  router.post("/place-bid/:bidProductId", controller.placeBid);
  router.get(
    "/get-bid-history/:bidProductId",
    controller.getBidDetailsOfUserOnProduct
  );
  router.get("/get-user-bids", controller.getUserBids);

  router.get("/my-participating-bids", controller.getMyParticipatingBids);
  router.get("/claim-bid-details/:productId", controller.getClaimBidDetails);
  router.post("/add-claimer-address/:bidId", controller.addBidClaimerAddress);
  router.get("/bid-result-owner/:productId", controller.getBidResultForOwner);

  return router;
};

export default bidRouter;
