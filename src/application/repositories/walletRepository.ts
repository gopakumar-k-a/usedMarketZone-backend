import { Types } from "mongoose";
import { WalletRepositoryMongoDb } from "../../frameworks/database/mongodb/repositories/walletRepositoryMongoDb";


export const walletRepository=(repository:ReturnType<WalletRepositoryMongoDb>)=>{
    const addAmountToUserWallet = async (
        userId: Types.ObjectId,
        amountInPaise: number
      ) =>repository.addAmountToUserWallet(userId,amountInPaise)
      const getUserWallet = async (userId: Types.ObjectId) =>await repository.getUserWallet(userId)
      return {
        addAmountToUserWallet,
        getUserWallet
      }
}

export type WalletInterface=typeof walletRepository
export type WalletRepository=ReturnType<typeof walletRepository>