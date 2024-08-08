import { Types } from "mongoose";

export const createWalletHistoryEntity = (
  productId: string | null,
  bidId: string | null,
  amount: number,
  type: "debit" | "credit" = "credit",
) => {
  return {
    getProductId: (): Types.ObjectId | null =>
      productId ? new Types.ObjectId(productId) : null,
    getBidId: (): Types.ObjectId | null =>
      bidId ? new Types.ObjectId(bidId) : null,
    getType: (): "debit" | "credit" => type,
    getAmount: (): number => amount,
  };
};

export type CreateWalletHistoryEntity = ReturnType<
  typeof createWalletHistoryEntity
>;
