import { CreateTransactionEntityType } from "../../entities/createTransactionEntity";
import { TransactionRepositoryMongoDb } from "../../frameworks/database/mongodb/repositories/transactionRepositoryMongoDb";

export const transactionRepository = (
  repository: ReturnType<TransactionRepositoryMongoDb>
) => {
  const addNewTransaction = async (
    transactionEntity: CreateTransactionEntityType
  ) => await repository.addNewTransaction(transactionEntity);

  return {
    addNewTransaction,
  };
};

export type TransactionInterface = typeof transactionRepository;

export type TransactionRepository = ReturnType<typeof transactionRepository>;
