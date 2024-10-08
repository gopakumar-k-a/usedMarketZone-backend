import { Types } from "mongoose";
import { WalletRepositoryMongoDb } from "../../frameworks/database/mongodb/repositories/walletRepositoryMongoDb";
import { CreateWalletHistoryEntity } from "../../entities/createWalletHistoryEntity";

export const walletRepository = (
  repository: ReturnType<WalletRepositoryMongoDb>
) => {
  const addAmountToUserWallet = async (
    userId: Types.ObjectId,
    amountInPaise: number,
    historyEntity: CreateWalletHistoryEntity
  ) =>
    await repository.addAmountToUserWallet(
      userId,
      amountInPaise,
      historyEntity
    );
  const getUserWallet = async (userId: Types.ObjectId) =>
    await repository.getUserWallet(userId);

  return {
    addAmountToUserWallet,
    getUserWallet,
  };
};

export type WalletInterface = typeof walletRepository;
export type WalletRepository = ReturnType<typeof walletRepository>;
