import { BidHistory } from "../models/bidHistoryModel";
import { IBidHistory } from "../models/bidHistoryModel";
import { CreateBidHistoryEntityType } from "../../../../entities/bidding/createBidHistory";
import mongoose, { mongo, Types } from "mongoose";
export const bidHistoryRepositoryMongoDb = () => {
  const createNewBidHistory = async (
    createBidHistoryEntity: CreateBidHistoryEntityType
  ): Promise<IBidHistory | null> => {
    const newBidHistory = await BidHistory.create({
      bidderId: createBidHistoryEntity.getBidderId(),
      bidAmount: createBidHistoryEntity.getBidAmount(),
      bidTime: createBidHistoryEntity.getBidTime(),
      bidData: createBidHistoryEntity.getBidData(),
      productId: createBidHistoryEntity.getProductId(),
    });

    console.log("newBidHistory ", newBidHistory);

    return newBidHistory;
  };

  const getHighestBid = async (bidIds: mongoose.Types.ObjectId[]) => {
    const highestBidDetails = await BidHistory.aggregate([
      { $match: { _id: { $in: bidIds } } },
      { $sort: { bidAmount: -1 } },
      { $limit: 1 },
    ]).exec();
    return highestBidDetails.length > 0 ? highestBidDetails[0] : null;
  };

  const getUserPreviousBidsSumOnProduct = async (
    bidderId: Types.ObjectId,
    bidProductId: Types.ObjectId
  ) => {
    console.log(`getUserPreviousBidsSum
          userId:${bidderId},
    bidProductId: ${bidProductId} `);

    interface PreviousBidSumOfUser {
      _id: Types.ObjectId;
      previousBidSumOfBidder: number;
    }
    const previousBidSumOfUser: PreviousBidSumOfUser[] =
      await BidHistory.aggregate<PreviousBidSumOfUser>([
        {
          $match: {
            productId: bidProductId,
            bidderId: bidderId,
          },
        },
        {
          $group: {
            _id: "$bidderId",
            previousBidSumOfBidder: { $sum: "$bidAmount" },
            bidDetails: { $push: "$$ROOT" }, // Optionally include bid details
          },
        },
        {
          $project: {
            previousBidSumOfBidder: 1,
          },
        },
      ]);

    return previousBidSumOfUser;
  };

  const getUserBidHistoryOnProduct = async (
    userId: mongoose.Types.ObjectId,
    productId: mongoose.Types.ObjectId
  ) => {
    const bidHistory = await BidHistory.aggregate([
      {
        $match: {
          bidderId: userId,
          productId: productId,
        },
      },
      {
        $project: {
          bidTime: 1,
          bidAmount: 1,
        },
      },
    ]);

    console.log("bidHistory ", bidHistory);

    return bidHistory;
  };

  const getProductBidHistoryAdmin = async (
    bidProductId: mongoose.Types.ObjectId
  ) => {
    //   bidder
    //   Bid Amount
    //   Bid Total Amount
    //   Time

    const bidHistory = await BidHistory.aggregate([
      {
        $match: {
          productId: bidProductId,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "bidderId",
          foreignField: "_id",
          as: "bidderDetails",
        },
      },

      {
        $unwind: "$bidderDetails",
      },

      {
        $group: {
          _id: "$bidderId",
          bidderName: { $first: "$bidderDetails.userName" },
          bids: {
            $push: {
              bidAmount: "$bidAmount",
              bidTime: "$bidTime",
            },
          },
          totalBidAmount: { $sum: "$bidAmount" },
        },
      },

      {
        $addFields: {
          lastBidDate: {
            $arrayElemAt: [
              {
                $map: {
                  input: { $reverseArray: "$bids" },
                  as: "bid",
                  in: "$$bid.bidTime",
                },
              },
              0,
            ],
          },
        },
      },
      {
        $project: {
          _id: 0,
          bidderId: "$_id",
          bidderName: 1,
          bids: 1,
          totalBidAmount: 1,
          lastBidDate: 1,
        },
      },
      {
        $sort: { lastBidDate: -1 },
      },
    ]);
    console.log("bidHistory ", bidHistory);
    return bidHistory;
  };

  // Notify all other bidders
  // const allBidders = await BidHistory.find({
  //   bidData: bidId,
  //   bidderId: { $ne: bidWinner }  // Exclude the highest bidder
  // }).select('bidderId');

  const getBidParticipents = async (
    bidWinnerId: Types.ObjectId,
    productId: Types.ObjectId
  ) => {
    const bidParticipents = await BidHistory.aggregate([
      {
        $match: {
          bidderId: { $ne: bidWinnerId },
          productId: productId,
        },
      },
      {
        $group: {
          _id: "$bidderId",
          productId: { $first: "$productId" },
          bidderId: { $first: "$bidderId" },
        },
      },
      {
        $project: {
          _id: 0,
          productId: 1,
          bidderId: 1,
        },
      },
    ]);

    console.log("bidParticipents ", bidParticipents);

    return bidParticipents;
  };

  const getUserParticipatingBids = async (userId: Types.ObjectId) => {
    const userBids = await BidHistory.aggregate([
      {
        $match: {
          bidderId: userId,
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "productData",
        },
      },
      {
        $unwind: "$productData",
      },
      {
        $lookup: {
          from: "bids",
          localField: "productId",
          foreignField: "productId",
          as: "bidData",
        },
      },
      {
        $unwind: "$bidData",
      },
      {
        $group: {
          _id: {
            productId: "$productId",
            userId: "$bidderId",
          },
          totalBidAmount: {
            $sum: "$bidAmount",
          },
          productData: {
            $first: "$productData",
          },
          bidData: {
            $first: "$bidData",
          },
        },
      },
      {
        $project: {
          _id: 0,
          productId: "$_id.productId",
          userId: "$bidData.userId",
          // userId: "$_id.userId",
          totalBidAmount: 1,
          productName: "$productData.productName",
          productBasePrice: "$productData.basePrice",
          productImageUrls: "$productData.productImageUrls",
          isMyHighestBid: {
            $eq: ["$bidData.highestBidderId", userId],
          },
          highestBidAmount: "$bidData.currentHighestBid",
          isBidEnded: {
            $lt: [Date.now(), "$bidData.bidEndTime"],
          },
          isBidAmountPaid: "$bidData.isBidAmountPaid",
          claimedUserId: "$bidData.claimedUserId",
        },
      },
    ]);

    console.log("userBids ", userBids);

    return userBids;
  };

  const getClaimableBidDetails = async (
    userId: Types.ObjectId,
    productId: Types.ObjectId
  ) => {
    
    const userBid = await BidHistory.aggregate([
      {
        $match: {
          bidderId: userId,
          productId: productId,
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "productData",
        },
      },
      {
        $unwind: "$productData",
      },
      {
        $lookup: {
          from: "bids",
          localField: "productId",
          foreignField: "productId",
          as: "bidData",
        },
      },
      {
        $unwind: "$bidData",
      },
      {
        $lookup: {
          from: "users",
          localField: "productData.userId",
          foreignField: "_id",
          as: "userData",
        },
      },
      {
        $addFields: {
          userData: {
            $filter: {
              input: "$userData",
              as: "user",
              cond: { $eq: ["$$user._id", "$productData.userId"] }
            }
          }
        }
      },
      {
        $unwind: "$userData",
      },
      {
        $group: {
          _id: {
            productId: "$productId",
            userId: "$bidderId",
          },
          totalBidAmount: {
            $sum: "$bidAmount",
          },
          productData: {
            $first: "$productData",
          },
          bidData: {
            $first: "$bidData",
          },
          userData: {
            $first: "$userData",
          },
        },
      },
      {
        $project: {
          _id: 0,
          productId: "$_id.productId",
          userId: "$bidData.userId",
          totalBidAmount: 1,
          productName: "$productData.productName",
          productBasePrice: "$productData.basePrice",
          productImageUrls: "$productData.productImageUrls",
          isMyHighestBid: {
            $eq: ["$bidData.highestBidderId", userId],
          },
          highestBidAmount: "$bidData.currentHighestBid",
          isBidEnded: {
            $lt: [Date.now(), "$bidData.bidEndTime"],
          },
          isBidAmountPaid: "$bidData.isBidAmountPaid",
          claimedUserId: "$bidData.claimedUserId",
          bidId: "$bidData._id",
          description: "$bidData.description",
          isClaimerAddressAdded: "$bidData.isClaimerAddressAdded",
          claimerAddress: "$bidData.claimerAddress",
          ownerData: {
            imageUrl: "$userData.imageUrl",
            userName: "$userData.userName",
            _id: "$userData._id",
            firstName: "$userData.firstName",
            lastName: "$userData.lastName",
          },
        },
      },
    ]);
    
    console.log(userBid);
    

    // return userBid;
    return userBid && userBid.length > 0 ? userBid[0] : null;
  };



  return {
    createNewBidHistory,
    getHighestBid,
    getUserPreviousBidsSumOnProduct,
    getUserBidHistoryOnProduct,
    getProductBidHistoryAdmin,
    getBidParticipents,
    getUserParticipatingBids,
    getClaimableBidDetails,
  };
};

export type BidHistoryRepositoryMongoDb = typeof bidHistoryRepositoryMongoDb;
