import { Types } from "mongoose";
import { WalletInterface } from "../../repositories/walletRepository";
import { TransactionInterface } from "../../repositories/transactionRepository";

export const handleGetUserWallet = async (
  userId: string,
  walletDb: ReturnType<WalletInterface>
) => {
  const wallet = await walletDb.getUserWallet(new Types.ObjectId(userId));

  return wallet;
};

export const handleGetTransactionHistoryUser = async (
  userId: string,
  transactionDb: ReturnType<TransactionInterface>
) => {
  const transactionHistory = await transactionDb.getTransactionHistoryUser(
    new Types.ObjectId(userId)
  );

  return transactionHistory;
};
