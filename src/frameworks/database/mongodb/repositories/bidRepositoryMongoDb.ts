import { Bid, IBid } from "../models/bidModel";

import { CreateBidEntityType } from "../../../../entities/bidding/createBidEntity";
import AppError from "../../../../utils/appError";
import { HttpStatusCodes } from "../../../../types/httpStatusCodes";

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

  const getBidDetails = async (productId: string):Promise<IBid | null> => {
    const bidData: IBid | null = await Bid.findOne({ productId });
    if (!bidData) {
      throw new AppError("invalid product id ", HttpStatusCodes.BAD_GATEWAY);
    }

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

    console.log('bidProduct .highest bidder id ',bidProduct.highestBidderId);
    

    return bidProduct.highestBidderId ? bidProduct.highestBidderId : false;
  };

  const getBidById=async(bidId: string):Promise<IBid >  =>{
    const bid = await Bid.findById(bidId);
    console.log('bid history ',bid?.bidHistory)


    
    if (!bid) {
      throw new AppError("invalid product id ", HttpStatusCodes.BAD_GATEWAY);
    }

    return bid;
  }

  const updateBid=async(bidId: string, update:IBid)=> {
    const updatedBid = await Bid.findByIdAndUpdate(bidId, update, { new: true });
    return updatedBid;
  }
  // const getHighestBidderDetails=async(productId:string)=>{
  //   const customerDetails``
  // }

  return { addBidAfterAdminAccept, getBidDetails, getHighestBidderDetails,getBidById,updateBid };
};

export type BidRepositoryMongoDb = typeof bidRepositoryMongoDb;
