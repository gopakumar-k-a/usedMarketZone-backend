import { Types } from "mongoose";
import { WalletInterface } from "../../repositories/walletRepository";

export const handleGetUserWallet = async (
    userId: string,
    walletDb: ReturnType<WalletInterface>
  ) => {
    const wallet = await walletDb.getUserWallet(new Types.ObjectId(userId));
  
    return wallet;
  };