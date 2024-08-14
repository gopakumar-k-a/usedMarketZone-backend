import Razorpay from "razorpay";
import configKeys from "../../../config";
import AppError from "../../../utils/appError";
import { HttpStatusCodes } from "../../../types/httpStatusCodes";
import { TransactionInterface } from "../../repositories/transactionRepository";
import { createTransactionEntity } from "../../../entities/createTransactionEntity";
import { WalletInterface } from "../../repositories/walletRepository";
import { Types } from "mongoose";
import { BidInterface } from "../../repositories/bidRepository";
import { createWalletHistoryEntity } from "../../../entities/createWalletHistoryEntity";

const razorpay = new Razorpay({
  key_id: "rzp_test_xgAbYbKWLNZHR0",

  key_secret: "pBaRn0FrJtHGQABUEkHfJwCZ",
});
export const handleCreatePaymentOrder = async (
  amount: number,
  currency: string,
  receipt: string,
  notes: {
    fromUserId: string;
    toUserId: string;
  },
  userId: string
) => {
  if (notes.fromUserId != userId) {
    throw new AppError(
      "Cant make payment ,payment is not secure ",
      HttpStatusCodes.BAD_GATEWAY
    );
  }

  const options = {
    amount: Number(amount * 100),
    currency,
    receipt,
    notes,
  };

  try {
    const order = await razorpay.orders.create(options);
    return order;
  } catch (error) {
    throw new AppError(
      "Failed to create payment order",
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

export const handleCapturePayment = async (
  payment_id: string,
  fromUserId: string,
  toUserId: string,
  amount: number,
  currency: string,
  productId: string,
  bidId: string,
  transactionDb: ReturnType<TransactionInterface>,
  walletDb: ReturnType<WalletInterface>,
  bidDb: ReturnType<BidInterface>
) => {
  let captureStatus: "captured" | "failed" = "failed";

  try {
    const payment = await razorpay.payments.fetch(payment_id);
    if (payment.status === "captured") {
      captureStatus = "captured";
    } else {
      // Capture the payment
      const captureResponse = await razorpay.payments.capture(
        payment_id,
        amount,
        currency
      );
      captureStatus =
        captureResponse.status === "captured" ? "captured" : "failed";
    }

    const newTransactionEntity = createTransactionEntity(
      fromUserId,
      null,
      amount,
      "escrow",
      productId,
      bidId
    );

    const transaction = await transactionDb.addNewEscrowTransaction(
      newTransactionEntity
    );
    if (transaction) {
      await bidDb.addTransactionIdToBid(
        new Types.ObjectId(productId),
        transaction._id as Types.ObjectId
      );
    }
    if (captureStatus === "captured") {
      await Promise.all([
        bidDb.updateBidWithClaimedUserId(
          new Types.ObjectId(productId),
          new Types.ObjectId(fromUserId)
        ),
      ]);
    }

    return { captureStatus, transaction };
  } catch (error) {
    console.error(error);
    throw new AppError(
      "Failed to capture payment",
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

export const handleShipProductToAdmin = async (
  productId: string,
  trackingNumber: string,
  transactionDb: ReturnType<TransactionInterface>
) => {
  const transaction = await transactionDb.getTransactionByProductId(productId);

  if (!transaction) {
    throw new AppError("cant find transaction", HttpStatusCodes.BAD_GATEWAY);
  }
  if (transaction.shipmentStatus == "delivered") {
    throw new AppError(
      "can't change the status, product is already delivered ",
      HttpStatusCodes.BAD_GATEWAY
    );
  }
  await transactionDb.shipProductToAdmin(productId, trackingNumber);

  return;
};

export const handleChangeShipmentStatusToAdminRecieved = async (
  transactionId: string,
  transactionDb: ReturnType<TransactionInterface>
) => {
  const transaction = await transactionDb.getTransactionById(transactionId);

  if (!transaction) {
    throw new AppError("cant find transaction", HttpStatusCodes.BAD_GATEWAY);
  }
  if (transaction.shipmentStatus == "delivered") {
    throw new AppError(
      "can't change the status, product is already delivered ",
      HttpStatusCodes.BAD_GATEWAY
    );
  }

  const updatedTransaction = await transactionDb.adminReceivesProduct(
    transactionId
  );
  return updatedTransaction;
};

export const handleShipProductToBidWinner = async (
  transactionId: string,
  trackingNumber: string,
  transactionDb: ReturnType<TransactionInterface>
) => {
  const transaction = await transactionDb.getTransactionById(transactionId);

  if (!transaction) {
    throw new AppError("cant find transaction", HttpStatusCodes.BAD_GATEWAY);
  }
  if (transaction.shipmentStatus == "delivered") {
    throw new AppError(
      "can't change the status, product is already delivered ",
      HttpStatusCodes.BAD_GATEWAY
    );
  }
  const updatedTransaction = await transactionDb.adminShipsProductToWinner(
    transactionId,
    trackingNumber
  );

  return updatedTransaction;
};

export const handleProductDeliveredToWinner = async (
  transactionId: string,
  productId: string,
  bidId: string,
  adminId: string,
  productOwnerId: string,
  transactionDb: ReturnType<TransactionInterface>,
  walletDb: ReturnType<WalletInterface>
) => {
  const transaction = await transactionDb.getTransactionById(transactionId);

  if (!transaction) {
    throw new AppError("cant find transaction", HttpStatusCodes.BAD_GATEWAY);
  }
  if (transaction.shipmentStatus == "delivered") {
    throw new AppError(
      "can't change the status, product is already delivered ",
      HttpStatusCodes.BAD_GATEWAY
    );
  }
  const commisionPercentage = 1;
  const commissionAmountInPaise =
    (transaction.amount * commisionPercentage) / 100;

  const amountAfterCommision = transaction.amount - commissionAmountInPaise;
  const adminWalletHistory = createWalletHistoryEntity(
    productId,
    bidId,
    commissionAmountInPaise
  );
  const productOwnerWalletHistory = createWalletHistoryEntity(
    productId,
    bidId,
    commissionAmountInPaise
  );
  await Promise.all([
    walletDb.addAmountToUserWallet(
      new Types.ObjectId(adminId),
      commissionAmountInPaise,
      adminWalletHistory
    ),
    walletDb.addAmountToUserWallet(
      new Types.ObjectId(productOwnerId),
      amountAfterCommision,
      productOwnerWalletHistory
    ),
    transactionDb.releasePayment(transactionId),
  ]);
};
