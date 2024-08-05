import { CreateTransactionEntityType } from "../../entities/createTransactionEntity";
import { TransactionRepositoryMongoDb } from "../../frameworks/database/mongodb/repositories/transactionRepositoryMongoDb";

export const transactionRepository = (
  repository: ReturnType<TransactionRepositoryMongoDb>
) => {
  const addNewEscrowTransaction = async (
    transactionEntity: CreateTransactionEntityType
  ) => await repository.addNewEscrowTransaction(transactionEntity);
  const getTransactionById = async (transactionId: string) =>
    await repository.getTransactionById(transactionId);
  const shipProductToAdmin = async (
    productId: string,
    trackingNumber: string
  ) => await repository.shipProductToAdmin(productId, trackingNumber);
  const adminReceivesProduct = async (transactionId: string) =>
    repository.adminReceivesProduct(transactionId);
  const adminShipsProductToWinner = async (
    transactionId: string,
    trackingNumber: string
  ) =>
    await repository.adminShipsProductToWinner(transactionId, trackingNumber);
  return {
    addNewEscrowTransaction,
    shipProductToAdmin,
    adminReceivesProduct,
    adminShipsProductToWinner,
    getTransactionById,
  };
};

export type TransactionInterface = typeof transactionRepository;

export type TransactionRepository = ReturnType<typeof transactionRepository>;
