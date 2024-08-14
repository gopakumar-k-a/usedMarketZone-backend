import mongoose from "mongoose";

export const createBidEntity = (
  productId: mongoose.Schema.Types.ObjectId,
  userId: mongoose.Schema.Types.ObjectId,
  baseBidPrice: string,
  bidEndTime: string
) => {
  return {
    getProductId: (): mongoose.Schema.Types.ObjectId => productId,
    getUserId: (): mongoose.Schema.Types.ObjectId => userId,
    getBaseBidPrice: (): number => parseInt(baseBidPrice),
    getBidEndTime: (): Date => new Date(bidEndTime),
  };
};

export type CreateBidEntityType = ReturnType<typeof createBidEntity>;
