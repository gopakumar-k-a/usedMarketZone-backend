import { Types } from "mongoose";

export const createTransactionEntity = (
  fromUserId: string,
  toUserId: string,
  amount: number,
  status: "captured" | "failed",
  transactionType: "debit" | "credit" = "credit"
) => {
  return {
    getFromUserId: (): Types.ObjectId => new Types.ObjectId(fromUserId),
    getToUserId: (): Types.ObjectId => new Types.ObjectId(toUserId),
    getAmount: (): number => amount,
    getStatus: (): "captured" | "failed" => status,
    getTransactionType: (): "debit" | "credit" => transactionType,
  };
};

export type CreateTransactionEntityType = ReturnType<
  typeof createTransactionEntity
>;
