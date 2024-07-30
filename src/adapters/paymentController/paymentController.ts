import asyncHandler from "express-async-handler";
import { Response } from "express";
import { ExtendedRequest } from "../../types/extendedRequest";
import { CreateUserInterface } from "../../types/userInterface";
import {
  handleCapturePayment,
  handleCreatePaymentOrder,
  handleGetUserWallet,
} from "../../application/user-cases/payment/update";
import { HttpStatusCodes } from "../../types/httpStatusCodes";
import { TransactionInterface } from "../../application/repositories/transactionRepository";
import { TransactionRepositoryMongoDb } from "../../frameworks/database/mongodb/repositories/transactionRepositoryMongoDb";
import { WalletInterface } from "../../application/repositories/walletRepository";
import { WalletRepositoryMongoDb } from "../../frameworks/database/mongodb/repositories/walletRepositoryMongoDb";
import { BidInterface } from "../../application/repositories/bidRepository";
import { BidRepositoryMongoDb } from "../../frameworks/database/mongodb/repositories/bidRepositoryMongoDb";

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
      const { payment_id, fromUserId, toUserId, amount, currency, productId } =
        req.body;
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
        dbTransaction,
        dbWallet,
        dbBid
      );
      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: "order created successfully",
        captureStatus,
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

  return {
    createPaymentOrder,
    capturePayment,
    getUserWallet,
  };
};
