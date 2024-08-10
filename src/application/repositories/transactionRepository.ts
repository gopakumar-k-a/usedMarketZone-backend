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
  const getTransactionByProductId=async(productId:string)=>await repository.getTransactionByProductId(productId)
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
    const releasePayment = async (transactionId: string) =>await repository.releasePayment(transactionId)
    const transactionStatistics=async()=>await repository.transactionStatistics()
    const lastTransactionsAdmin = async () =>await repository.lastTransactionsAdmin()
  return {
    addNewEscrowTransaction,
    shipProductToAdmin,
    adminReceivesProduct,
    adminShipsProductToWinner,
    getTransactionById,
    releasePayment,
    getTransactionByProductId,
    transactionStatistics,
    lastTransactionsAdmin
  };
};

export type TransactionInterface = typeof transactionRepository;

export type TransactionRepository = ReturnType<typeof transactionRepository>;
