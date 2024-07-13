import mongoose, { mongo } from "mongoose";

export const createBidHistoryEntity = (
  bidderId: string,
  bidData: string,
  productId: string,
  bidAmount: string,
  bidTime: Date
) => {
  return {
    getBidderId: (): mongoose.Types.ObjectId =>
      new mongoose.Types.ObjectId(bidderId),
    getBidData: (): mongoose.Types.ObjectId =>
      new mongoose.Types.ObjectId(bidData),
    getProductId: (): mongoose.Types.ObjectId =>
      new mongoose.Types.ObjectId(productId),
    getBidAmount: (): number => parseInt(bidAmount),
    getBidTime: (): Date => bidTime,
  };
};

export type CreateBidHistoryEntityType = ReturnType<
  typeof createBidHistoryEntity
>;
