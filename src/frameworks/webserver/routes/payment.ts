import express from "express";
import { paymentController } from "../../../adapters/paymentController/paymentController";
import { transactionRepository } from "../../../application/repositories/transactionRepository";
import { transactionRepositoryMongoDb } from "../../database/mongodb/repositories/transactionRepositoryMongoDb";
import { walletRepository } from "../../../application/repositories/walletRepository";
import { walletRepositoryMongoDb } from "../../database/mongodb/repositories/walletRepositoryMongoDb";
import { bidDbRepository } from "../../../application/repositories/bidRepository";
import { bidRepositoryMongoDb } from "../../database/mongodb/repositories/bidRepositoryMongoDb";
const paymenRouter = () => {
  const router = express.Router();

  const controller = paymentController(
    transactionRepository,
    transactionRepositoryMongoDb,
    walletRepository,
    walletRepositoryMongoDb,
    bidDbRepository,
    bidRepositoryMongoDb
  );

  router.post("/create-payment-order", controller.createPaymentOrder);
  router.post("/capture-payment", controller.capturePayment);
  router.get("/user-wallet", controller.getUserWallet);
  router.post("/ship-product-to-admin", controller.shipProductToAdmin);
  router.get("/transaction-history", controller.getTransactionHistoryUser);

  return router;
};

export default paymenRouter;
