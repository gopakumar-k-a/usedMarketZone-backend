import { Types } from "mongoose";

export const createTransactionEntity = (
  fromUserId: string,
  toUserId: string | null,
  amount: number,
  status: "captured" | "failed" | "escrow" | "released",
  productId: string,
  bidId: string,
  transactionType: "debit" | "credit" = "credit"
) => {
  return {
    getFromUserId: (): Types.ObjectId => new Types.ObjectId(fromUserId),
    getToUserId: (): Types.ObjectId | null =>
      toUserId ? new Types.ObjectId(toUserId) : null,
    getAmount: (): number => amount,
    getStatus: (): "captured" | "failed" | "escrow" | "released" => status,
    getTransactionType: (): "debit" | "credit" => transactionType,
    getProductId: (): string => productId,
    getBidId: (): string => bidId,
  };
};

export type CreateTransactionEntityType = ReturnType<
  typeof createTransactionEntity
>;
