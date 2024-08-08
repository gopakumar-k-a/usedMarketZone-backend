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

  const getTransactionById = async (transactionId: string) => {
    const transaction = await Transaction.findOne({ _id: transactionId });
    return transaction;
  };

  const getTransactionByProductId=async(productId:string)=>{
    const transaction=await Transaction.findOne({productId:productId})
    return transaction
  }
  const shipProductToAdmin = async (
    productId: string,
    trackingNumber: string
  ) => {
    const transaction = await Transaction.findOne({ productId });
    console.log("transaction shipProductToAdmin", transaction);
    if (transaction) {
      transaction.shipmentStatus = "shipped_to_admin";
      transaction.trackingNumbers.shippedToAdminTrackingNumber = trackingNumber;
      await transaction.save();
      return transaction;
    }
    throw new AppError("Transaction not found", HttpStatusCodes.BAD_GATEWAY);
  };

  const adminReceivesProduct = async (transactionId: string) => {
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      transactionId,
      { shipmentStatus: "received_by_admin" },
      { new: true }
    );

    if (!updatedTransaction) {
      throw new AppError(
        "some thing went wrong cant change status ",
        HttpStatusCodes.BAD_GATEWAY
      );
    }

    return updatedTransaction;
  };

  const adminShipsProductToWinner = async (
    transactionId: string,
    trackingNumber: string
  ) => {
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      transactionId,
      {
        shipmentStatus: "shipped_to_buyer",
        "trackingNumbers.shippedToBuyerTrackingNumber": trackingNumber,
      },
      { new: true }
    );
    if (!updatedTransaction) {
      throw new AppError(
        "some thing went wrong cant change status ",
        HttpStatusCodes.BAD_GATEWAY
      );
    }
    return updatedTransaction;
  };

  const buyerConfirmsReceipt = async (transactionId: string) => {
    await Transaction.findByIdAndUpdate(transactionId, {
      shipmentStatus: "delivered",
    });
  };

  const releasePayment = async (transactionId: string) => {
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      transactionId,
      {
        $set: { status: "released", shipmentStatus: "delivered" },
      },
      { new: true }
    );
    if (!updatedTransaction) {
      throw new AppError(
        "some thing went wrong cant change payment status status ",
        HttpStatusCodes.BAD_GATEWAY
      );
    }
    return;
  };

  return {
    addNewEscrowTransaction,
    shipProductToAdmin,
    adminReceivesProduct,
    adminShipsProductToWinner,
    getTransactionById,
    releasePayment,
    getTransactionByProductId
  };
};

export type TransactionRepositoryMongoDb = typeof transactionRepositoryMongoDb;
