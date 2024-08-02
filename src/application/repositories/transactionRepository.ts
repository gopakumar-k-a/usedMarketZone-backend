import { CreateTransactionEntityType } from "../../entities/createTransactionEntity";
import { TransactionRepositoryMongoDb } from "../../frameworks/database/mongodb/repositories/transactionRepositoryMongoDb";

export const transactionRepository = (
  repository: ReturnType<TransactionRepositoryMongoDb>
) => {
  const addNewEscrowTransaction = async (
    transactionEntity: CreateTransactionEntityType
  ) => await repository.addNewEscrowTransaction(transactionEntity);
  const shipProductToAdmin = async (
    productId: string,
    trackingNumber: string
  ) => await repository.shipProductToAdmin(productId, trackingNumber);
  return {
    addNewEscrowTransaction,
    shipProductToAdmin,
  };
};

export type TransactionInterface = typeof transactionRepository;

export type TransactionRepository = ReturnType<typeof transactionRepository>;
