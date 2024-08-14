import { Bid, IBid } from "../models/bidModel";

import { CreateBidEntityType } from "../../../../entities/bidding/createBidEntity";
import AppError from "../../../../utils/appError";
import { HttpStatusCodes } from "../../../../types/httpStatusCodes";
import { Types } from "mongoose";
import { CreateBidClaimerAddressEntityType } from "../../../../entities/bidding/createBidClaimerAddress";

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

  const addBidClaimerAddress = async (
    bidId: Types.ObjectId,
    addressEntity: CreateBidClaimerAddressEntityType
  ) => {
    const newAddress = await Bid.findByIdAndUpdate(
      bidId,
      {
        $set: {
          claimerAddress: {
            country: addressEntity.getCountry(),
            state: addressEntity.getState(),
            district: addressEntity.getDistrict(),
            city: addressEntity.getCity(),
            postalCode: addressEntity.getPostalCode(),
            phone: addressEntity.getPhone(),
          },
          isClaimerAddressAdded: true,
        },
      },
      { new: true }
    );
    return newAddress?.claimerAddress;
  };

  const bidResultsForOwner = async (
    productId: Types.ObjectId,
    userId: Types.ObjectId
  ) => {
    console.log("product id userId", productId, " ", userId);

    const result = await Bid.aggregate([
      { $match: { productId: productId, userId: userId } },

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
          from: "users",
          let: { highestBidderId: "$highestBidderId" },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$highestBidderId"] } } },
          ],
          as: "winnerData",
        },
      },

      { $unwind: { path: "$winnerData", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "transactions",
          localField: "transactionId",
          foreignField: "_id",
          as: "transactionData",
        },
      },

      {
        $unwind: { path: "$transactionData", preserveNullAndEmptyArrays: true },
      },

      {
        $project: {
          _id: 1,
          productId: 1,
          userId: 1,
          baseBidPrice: 1,
          currentHighestBid: 1,
          bidEndTime: 1,
          bidHistory: 1,
          isAdminVerified: 1,
          biddingStatus: 1,
          createdAt: 1,
          updatedAt: 1,
          highestBidderHistoryId: 1,
          highestBidderId: 1,
          claimerAddress: 1,
          isClaimerAddressAdded: 1,
          claimedUserId: 1,
          isBidAmountPaid: 1,
          "productData._id": 1,
          "productData.productName": 1,
          "productData.basePrice": 1,
          "productData.userId": 1,
          "productData.productImageUrls": 1,
          "productData.category": 1,
          "productData.subCategory": 1,
          "productData.phone": 1,
          "productData.description": 1,
          "productData.createdAt": 1,
          "productData.productCondition": 1,
          "productData.productAge": 1,
          "productData.address": 1,
          "productData.bookmarkedUsers": 1,
          "productData.bookmarkedCount": 1,
          "productData.isBlocked": 1,
          "productData.isSold": 1,
          "productData.isOtpVerified": 1,
          "productData.postStatus": 1,
          "productData.isBidding": 1,
          "productData.isAdminAccepted": 1,
          "productData.bidAcceptedTime": 1,
          "productData.bidDuration": 1,
          "productData.bidEndTime": 1,
          "productData.bidData": 1,
          "winnerData.imageUrl": 1,
          "winnerData.userName": 1,
          "winnerData._id": 1,
          "winnerData.firstName": 1,
          "winnerData.lastName": 1,
          "transactionData._id": 1,
          "transactionData.fromUserId": 1,
          "transactionData.toUserId": 1,
          "transactionData.amount": 1,
          "transactionData.status": 1,
          "transactionData.transactionType": 1,
          "transactionData.createdAt": 1,
          "transactionData.updatedAt": 1,
          "transactionData.productId": 1,
          "transactionData.bidId": 1,
          "transactionData.shipmentStatus": 1,
          "transactionData.trackingNumbers": 1,
        },
      },
    ]);

    console.log("bid end result owner ", result);
    return result ? result[0] : null;
  };

  const addTransactionIdToBid = async (
    productId: Types.ObjectId,
    transactionId: Types.ObjectId
  ) => {
    const bidData = await Bid.findOne({ productId });
    if (bidData) {
      bidData.transactionId = transactionId;
      await bidData.save();
      return;
    }
    throw new AppError("No BidData Found", HttpStatusCodes.BAD_GATEWAY);
  };
  const markBidAsEnded = async (bidId: Types.ObjectId) => {
    const bidData = await Bid.findOne({ _id: bidId });
    if (bidData) {
      bidData.isBiddingEnded = true;
      await bidData.save();
      return;
    }
    throw new AppError("No BidData Found", HttpStatusCodes.BAD_GATEWAY);
  };

  const getTransactionDetailsOfBidEndedProductsAdmin = async (
    page: number = 1,
    limit: number = 5,
    searchQuery: string = "",
    sort: string = "createdAt_desc",
    shipmentStatus: string = "",
    paymentStatus: string = "",
    fromDate: string = "",
    toDate: string = ""
  ) => {

    console.log('from date is ',fromDate);
    console.log('to date is ',toDate);
    
    console.log("page is ", page);
    const skip = (page - 1) * limit;

    console.log("skip is ", skip);

    console.log("sort ", sort);
    console.log("shipmentStatus ", shipmentStatus);
    const filters: { [key: string]: any } = {};
    if (shipmentStatus) {
      filters["transactionData.shipmentStatus"] = shipmentStatus;
    }
    if (paymentStatus) {
      filters["transactionData.status"] = paymentStatus;
    }
    type SortCriteria = {
      [key: string]: 1 | -1;
    };

    const sortCriteria: SortCriteria = {};
    const dateRangeFilter: { [key: string]: any } = {};
    if (fromDate && toDate) {
      dateRangeFilter["transactionData.createdAt"] = { $gte: new Date(fromDate), $lte: new Date(toDate) };
    } else if (fromDate) {
      dateRangeFilter["transactionData.createdAt"] = { $gte: new Date(fromDate) };
    } else if (toDate) {
      dateRangeFilter["transactionData.createdAt"] = { $lte: new Date(toDate) };
    }

    console.log('dateRangeFilter ',dateRangeFilter);
    
    switch (sort) {
      case "createdAt_asc":
        sortCriteria.createdAt = 1;
        break;
      case "createdAt_desc":
        sortCriteria.createdAt = -1;
        break;
      case "price_asc":
        sortCriteria.baseBidPrice = 1;
        break;
      case "price_desc":
        sortCriteria.baseBidPrice = -1;
        break;
      default:
        sortCriteria.createdAt = -1;
    }
    console.log("sortCriteria ", sortCriteria);

    const searchCriteria: any = {};
    if (searchQuery) {
      searchCriteria.$or = [
        { "productData.productName": { $regex: searchQuery, $options: "i" } }, // Case-insensitive search by product name
        { "productData._id": { $regex: searchQuery, $options: "i" } }, // Case-insensitive search by product name
        { "transactionData.status": { $regex: searchQuery, $options: "i" } }, // Case-insensitive search by transaction status
        {
          "transactionData.paymentStatus": {
            $regex: searchQuery,
            $options: "i",
          },
        }, // Case-insensitive search by payment status
        {
          "transactionData.shipmentStatus": {
            $regex: searchQuery,
            $options: "i",
          },
        }, // Case-insensitive search by shipment status
        { highestWinnerId: { $regex: searchQuery, $options: "i" } }, // Case-insensitive search by highest winner ID
      ];
    }
    const transactions = await Bid.aggregate([
      {
        $match: {
          isBiddingEnded: true,
        },
      },
      {
        $lookup: {
          from: "transactions",
          localField: "transactionId",
          foreignField: "_id",
          as: "transactionData",
        },
      },
      {
        $unwind: "$transactionData",
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
        $match: {
          ...searchCriteria,
          ...filters,
          ...(Object.keys(dateRangeFilter).length ? dateRangeFilter : {}),
        },
      },
      {
        $project: {
          _id: 0,
          bidId: "$_id",
          productId: "$productId",
          transactionId: "$transactionData._id",
          ownerId: "$productData.userId",
          highestWinnerId: "$highestWinnerId",
          claimerAddress: "$claimerAddress",
          paymentStatus: "$transactionData.paymentStatus",
          transactionStatus: "$transactionData.status",
          shipmentStatus: "$transactionData.shipmentStatus",
          price: "$transactionData.price",
          trackingNumbers: "$transactionData.trackingNumbers",
          wonPrice: "$currentHighestBid",
          baseBidPrice: "$baseBidPrice",
          bidWinnerId: "$highestBidderId",
          productData: "$productData",
          createdAt: 1,
        },
      },
      {
        $sort: sortCriteria,
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ]);

    console.log("transactions ", transactions);

    // const totalDocuments = await Bid.countDocuments(searchCriteria);
    // console.log("total documents ", totalDocuments);

    const totalDocuments = await Bid.aggregate([
      {
        $match: {
          isBiddingEnded: true,
          ...searchCriteria,
          ...filters,
          ...(Object.keys(dateRangeFilter).length ? dateRangeFilter : {}),
        },
      },
      {
        $count: "totalCount",
      },
    ]);

    const totalDocumentsCount =
      totalDocuments.length > 0 ? totalDocuments[0].totalCount : 0;

    return {
      transactions,
      totalDocuments: totalDocumentsCount,
      currentPage: page,
    };
  };
  return {
    addBidAfterAdminAccept,
    getBidDetails,
    getHighestBidderDetails,
    getBidById,
    updateBid,
    placeBid,
    updateBidWithClaimedUserId,
    addBidClaimerAddress,
    bidResultsForOwner,
    addTransactionIdToBid,
    markBidAsEnded,
    getTransactionDetailsOfBidEndedProductsAdmin,
    // addHighestBidHistoryIdToBid
  };
};

export type BidRepositoryMongoDb = typeof bidRepositoryMongoDb;
