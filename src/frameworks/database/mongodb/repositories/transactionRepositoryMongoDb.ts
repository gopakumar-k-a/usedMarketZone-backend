import { Types } from "mongoose";
import { Transaction } from "../models/TransactionModel";
import { CreateTransactionEntityType } from "../../../../entities/createTransactionEntity";
import AppError from "../../../../utils/appError";
import { HttpStatusCodes } from "../../../../types/httpStatusCodes";
export const transactionRepositoryMongoDb = () => {
  const addNewEscrowTransaction = async (
    transactionEntity: CreateTransactionEntityType
  ) => {
    const transaction = new Transaction({
      fromUserId: transactionEntity.getFromUserId(),
      toUserId: transactionEntity.getToUserId(),
      amount: transactionEntity.getAmount(),
      status: transactionEntity.getStatus(),
      bidId: transactionEntity.getBidId(),
      productId: transactionEntity.getProductId(),
    });

    await transaction.save();

    return transaction;
  };

  const shipProductToAdmin = async (
    productId: string,
    trackingNumber: string
  ) => {
    const transaction = await Transaction.findOne({ productId })
    console.log('transaction shipProductToAdmin',transaction);
    ;
    if (transaction) {
      transaction.shipmentStatus = "shipped_to_admin";
      transaction.trackingNumbers.shippedToAdminTrackingNumber = trackingNumber;
      await transaction.save();
      return transaction;
    }
    throw new AppError("Transaction not found", HttpStatusCodes.BAD_GATEWAY);
  };

  return {
    addNewEscrowTransaction,
    shipProductToAdmin,
  };
};

export type TransactionRepositoryMongoDb = typeof transactionRepositoryMongoDb;
