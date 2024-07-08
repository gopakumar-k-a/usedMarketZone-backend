import mongoose from "mongoose";

export const createBidHistoryEntity = (
  bidderId: string,
  bidAmount: string,
  bidTime: Date
) => {
  return {
    getBidderId: (): mongoose.Types.ObjectId =>
      new mongoose.Types.ObjectId(bidderId),
    getBidAmount: (): number => parseInt(bidAmount),
    getBidTime: (): Date => bidTime,
  };
};

export type CreateBidHistoryEntityType = ReturnType<
  typeof createBidHistoryEntity
>;
