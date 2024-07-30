import { Types } from "mongoose";
import { Transaction } from "../models/TransactionModel";
import { CreateTransactionEntityType } from "../../../../entities/createTransactionEntity";
export const transactionRepositoryMongoDb = () => {
  const addNewTransaction = async (
    transactionEntity: CreateTransactionEntityType
  ) => {
    const transaction = new Transaction({
      fromUserId: transactionEntity.getFromUserId(),
      toUserId: transactionEntity.getToUserId(),
      amount: transactionEntity.getAmount(),
      status: transactionEntity.getStatus(),
    });

    await transaction.save();

    return transaction;
  };

  return {
    addNewTransaction,
  };
};

export type TransactionRepositoryMongoDb = typeof transactionRepositoryMongoDb;
