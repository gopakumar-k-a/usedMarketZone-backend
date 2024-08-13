import asyncHandler from "express-async-handler";
import { Response } from "express";
import { ExtendedRequest } from "../../types/extendedRequest";
import { CreateUserInterface } from "../../types/userInterface";
import {
  handleCapturePayment,
  handleCreatePaymentOrder,
  handleShipProductToAdmin,
} from "../../application/user-cases/payment/update";
import { HttpStatusCodes } from "../../types/httpStatusCodes";
import { TransactionInterface } from "../../application/repositories/transactionRepository";
import { TransactionRepositoryMongoDb } from "../../frameworks/database/mongodb/repositories/transactionRepositoryMongoDb";
import { WalletInterface } from "../../application/repositories/walletRepository";
import { WalletRepositoryMongoDb } from "../../frameworks/database/mongodb/repositories/walletRepositoryMongoDb";
import { BidInterface } from "../../application/repositories/bidRepository";
import { BidRepositoryMongoDb } from "../../frameworks/database/mongodb/repositories/bidRepositoryMongoDb";
import {
  handleGetTransactionHistoryUser,
  handleGetUserWallet,
} from "../../application/user-cases/payment/get";

export const paymentController = (
  transactionDbRepository: TransactionInterface,
  transactionImpl: TransactionRepositoryMongoDb,
  walletDbRepository: WalletInterface,
  walletImpl: WalletRepositoryMongoDb,
  bidDbRepository: BidInterface,
  bidImpl: BidRepositoryMongoDb
) => {
  const dbTransaction = transactionDbRepository(transactionImpl());
  const dbWallet = walletDbRepository(walletImpl());
  const dbBid = bidDbRepository(bidImpl());
  const createPaymentOrder = asyncHandler(
    async (req: ExtendedRequest, res: Response) => {
      const { _id: userId } = req.user as CreateUserInterface;
      const { amount, currency, receipt, notes } = req.body;

      console.log(`amount ${amount}, 
            currency ${currency}, 
            receipt ${receipt},
             notes ${notes}`);
      const order = await handleCreatePaymentOrder(
        amount,
        currency,
        receipt,
        notes,
        userId
      );

      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: "order created successfully",
        order,
      });
    }
  );

  const capturePayment = asyncHandler(
    async (req: ExtendedRequest, res: Response) => {
      const {
        payment_id,
        fromUserId,
        toUserId,
        amount,
        currency,
        productId,
        bidId,
      } = req.body;
      console.log("capturePayment ");

      console.log(
        "payment_id, fromUserId, toUserId, amount, currency,productId",
        payment_id,
        fromUserId,
        toUserId,
        amount,
        currency,
        productId
      );

      const captureStatus = await handleCapturePayment(
        payment_id,
        fromUserId,
        toUserId,
        amount,
        currency,
        productId,
        bidId,
        dbTransaction,
        dbWallet,
        dbBid
      );
      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: "order created successfully",
        captureStatus: captureStatus.captureStatus,
        transactionData: captureStatus.transaction,
      });
    }
  );

  const getUserWallet = asyncHandler(
    async (req: ExtendedRequest, res: Response) => {
      const { _id: userId } = req.user as CreateUserInterface;

      const wallet = await handleGetUserWallet(userId, dbWallet);
      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: "wallet Data  Retrived successfully",
        wallet,
      });
    }
  );

  const shipProductToAdmin = asyncHandler(
    async (req: ExtendedRequest, res: Response) => {
      const { productId, trackingNumber } = req.body;

      await handleShipProductToAdmin(productId, trackingNumber, dbTransaction);
      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: "tracking data submitted to admin successfully",
      });
    }
  );

  const getTransactionHistoryUser = asyncHandler(
    async (req: ExtendedRequest, res: Response) => {
      const { _id: userId } = req.user as CreateUserInterface;
      const transactionHistory = await handleGetTransactionHistoryUser(
        userId,
        dbTransaction
      );

      console.log('transactionHistory is ',transactionHistory);
      

      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: "transaction history retrived successfully",
        transactionHistory,
      });
    }
  );

  return {
    createPaymentOrder,
    capturePayment,
    getUserWallet,
    shipProductToAdmin,
    getTransactionHistoryUser,
  };
};
