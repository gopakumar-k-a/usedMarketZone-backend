import { Bid, IBid } from "../models/bidModel";

import { CreateBidEntityType } from "../../../../entities/bidding/createBidEntity";
import AppError from "../../../../utils/appError";
import { HttpStatusCodes } from "../../../../types/httpStatusCodes";
import { Types } from "mongoose";

export const bidRepositoryMongoDb = () => {
  const addBidAfterAdminAccept = async (
    createBidEntity: CreateBidEntityType
  ) => {
    const createdBid = await Bid.create({
      productId: createBidEntity.getProductId(),
      userId: createBidEntity.getUserId(),
      baseBidPrice: createBidEntity.getBaseBidPrice(),
      bidEndTime: createBidEntity.getBidEndTime(),
    });

    return createdBid;
  };

  const getBidDetails = async (productId: string): Promise<IBid | null> => {
    const bidData: IBid | null = await Bid.findOne({ productId });
    // const bidData: IBid[] | null = await Bid.aggregate([
    //   {
    //     $match: new Types.ObjectId(productId),
    //   },
    //   {
    //     $lookup: {
    //       from: "users",
    //       foreignField: "_id",
    //       localField: "productId",
    //       as: "productData",
    //     },
    //   },
    //   {
    //     $unwind: "$productData",
    //   },
    // ]);
    // console.log('bid product name ',bidData[0].productData.productName);

    if (!bidData) {
      throw new AppError("invalid product id ", HttpStatusCodes.BAD_GATEWAY);
    }

    // return bidData[0];
    return bidData;
  };

  const getHighestBidderDetails = async (productId: string) => {
    const bidProduct = await Bid.findOne({ productId });
    if (!bidProduct) {
      throw new AppError(
        "no bid product found please check product id ",
        HttpStatusCodes.BAD_GATEWAY
      );
    }

    console.log("bidProduct .highest bidder id ", bidProduct.highestBidderId);

    return bidProduct.highestBidderId ? bidProduct.highestBidderId : false;
  };

  const getBidById = async (bidId: string): Promise<IBid> => {
    const bid = await Bid.findById(bidId);
    console.log("bid history ", bid?.bidHistory);

    if (!bid) {
      throw new AppError("invalid product id ", HttpStatusCodes.BAD_GATEWAY);
    }

    return bid;
  };

  const updateBid = async (bidId: string, update: IBid) => {
    const updatedBid = await Bid.findByIdAndUpdate(bidId, update, {
      new: true,
    });
    return updatedBid;
  };

  const placeBid = async (
    bidHistoryId: Types.ObjectId,
    bidId: Types.ObjectId,
    currentHighestBid: number,
    highestBidderId: Types.ObjectId
  ) => {
    console.log(
      `inside place bid mongo db bidHistoryId,bidId,currentHighestBid,highestBidderId`,
      bidHistoryId,
      bidId,
      currentHighestBid,
      highestBidderId
    );

    //add current highest bid, highest bidder id push bid history id to bid
    //set "highestBidderHistoryId" as bid history id
    const updatedBid = await Bid.updateOne(
      { _id: bidId },
      {
        $push: { bidHistory: bidHistoryId },
        $set: {
          highestBidderHistoryId: bidHistoryId,
          currentHighestBid: currentHighestBid,
          highestBidderId: highestBidderId,
        },
      },
      { new: true }
    );

    return placeBid;
  };

  // await BidData.updateOne(
  //   { productId },
  //   { $set: { claimedUserId: fromUserId } }
  // );

  const updateBidWithClaimedUserId = async (
    productId: Types.ObjectId,
    fromUserId: Types.ObjectId
  ) => {
    await Bid.updateOne(
      { productId },
      { $set: { claimedUserId: fromUserId, isBidAmountPaid: true } }
    );
    return;
  };

  // Notify all other bidders
  // const allBidders = await BidHistory.find({
  //   bidData: bidId,
  //   bidderId: { $ne: bidWinner }  // Exclude the highest bidder
  // }).select('bidderId');

  return {
    addBidAfterAdminAccept,
    getBidDetails,
    getHighestBidderDetails,
    getBidById,
    updateBid,
    placeBid,
    updateBidWithClaimedUserId,
    // addHighestBidHistoryIdToBid
  };
};

export type BidRepositoryMongoDb = typeof bidRepositoryMongoDb;
