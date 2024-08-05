import Razorpay from "razorpay";
import configKeys from "../../../config";
import AppError from "../../../utils/appError";
import { HttpStatusCodes } from "../../../types/httpStatusCodes";
import { TransactionInterface } from "../../repositories/transactionRepository";
import { createTransactionEntity } from "../../../entities/createTransactionEntity";
import { WalletInterface } from "../../repositories/walletRepository";
import { Types } from "mongoose";
import { BidInterface } from "../../repositories/bidRepository";

const razorpay = new Razorpay({
  // key_id: configKeys.RAZOR_KEY_ID,
  key_id: "rzp_test_xgAbYbKWLNZHR0",

  key_secret: "pBaRn0FrJtHGQABUEkHfJwCZ",
  // key_secret: configKeys.RAZOR_KEY_SECRET,
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
  console.log(`notes.fromUserId ${notes.fromUserId}
        notes.toUserId ${notes.toUserId}`);

  if (notes.fromUserId != userId) {
    throw new AppError(
      "Cant make payment ,payment is not secure ",
      HttpStatusCodes.BAD_GATEWAY
    );
  }

  console.log(`key  id ${configKeys.RAZOR_KEY_ID}`);
  console.log(`key secret ${configKeys.RAZOR_KEY_SECRET}`);

  const options = {
    amount: Number(amount * 100),
    currency,
    receipt,
    notes,
  };
  console.log("options ", options);

  try {
    const order = await razorpay.orders.create(options);
    console.log("order ", order);
    return order;
  } catch (error) {
    console.error("Order creation failed:", error);
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
        // walletDb.addAmountToUserWallet(new Types.ObjectId(toUserId), amount),
        bidDb.updateBidWithClaimedUserId(
          new Types.ObjectId(productId),
          new Types.ObjectId(fromUserId)
        ),
      ]);
    }

    return captureStatus;
  } catch (error) {
    console.error(error);
    throw new AppError(
      "Failed to capture payment",
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

export const handleGetUserWallet = async (
  userId: string,
  walletDb: ReturnType<WalletInterface>
) => {
  const wallet = await walletDb.getUserWallet(new Types.ObjectId(userId));

  return wallet;
};

export const handleShipProductToAdmin = async (
  productId: string,
  trackingNumber: string,
  transactionDb: ReturnType<TransactionInterface>
) => {
  await transactionDb.shipProductToAdmin(productId, trackingNumber);

  return;
};

export const handleChangeShipmentStatusToAdminRecieved = async (
  transactionId: string,
  transactionDb: ReturnType<TransactionInterface>
) => {
  console.log("transactionId ", transactionId);

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
  const updatedTransaction = await transactionDb.adminShipsProductToWinner(
    transactionId,
    trackingNumber
  );

  return updatedTransaction;
};

export const handleProductDeliveredToWinner = async (
  transactionId: string,
  transactionDb: ReturnType<TransactionInterface>,
  walletDb:ReturnType<WalletInterface>
) => {
  // const transaction = await AdminTransaction.findById(transactionId);
  const transaction = await transactionDb.getTransactionById(transactionId);

  if (!transaction) {
    throw new AppError("cant find transaction", HttpStatusCodes.BAD_GATEWAY);
  }
  // const commissionRate = transaction.commissionRate;
  const commissionAmount = (transaction.amount * 1) / 100;
  console.log("commissionAmount ", commissionAmount);

  // const escrowAmount = transaction.escrowAmount;
  // const commissionAmount = (escrowAmount * commissionRate) / 100;
  // const amountTransferredToSeller = escrowAmount - commissionAmount;
  // await AdminTransaction.findByIdAndUpdate(transactionId, {
  //   commissionAmount,
  //   amountTransferredToSeller,
  //   paymentStatus: "completed",
  // });
};
