"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const paymentController_1 = require("../../../adapters/paymentController/paymentController");
const transactionRepository_1 = require("../../../application/repositories/transactionRepository");
const transactionRepositoryMongoDb_1 = require("../../database/mongodb/repositories/transactionRepositoryMongoDb");
const walletRepository_1 = require("../../../application/repositories/walletRepository");
const walletRepositoryMongoDb_1 = require("../../database/mongodb/repositories/walletRepositoryMongoDb");
const bidRepository_1 = require("../../../application/repositories/bidRepository");
const bidRepositoryMongoDb_1 = require("../../database/mongodb/repositories/bidRepositoryMongoDb");
const paymenRouter = () => {
    const router = express_1.default.Router();
    const controller = (0, paymentController_1.paymentController)(transactionRepository_1.transactionRepository, transactionRepositoryMongoDb_1.transactionRepositoryMongoDb, walletRepository_1.walletRepository, walletRepositoryMongoDb_1.walletRepositoryMongoDb, bidRepository_1.bidDbRepository, bidRepositoryMongoDb_1.bidRepositoryMongoDb);
    router.post("/create-payment-order", controller.createPaymentOrder);
    router.post("/capture-payment", controller.capturePayment);
    router.get("/user-wallet", controller.getUserWallet);
    router.post("/ship-product-to-admin", controller.shipProductToAdmin);
    router.get("/transaction-history", controller.getTransactionHistoryUser);
    return router;
};
exports.default = paymenRouter;
