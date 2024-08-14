import { Types } from "mongoose";
import AdminBidRequest from "../models/adminBidRequestModel";

export const adminBidRequestMongoDb = () => {
  const createBidRequestAdmin = async (
    bidProductId: string,
    bidderId: string
  ) => {
    const newBidRequest = new AdminBidRequest({
      bidderId,
      bidProductId,
    });

    await newBidRequest.save();

    return newBidRequest;
  };

  const getBidRequestsFromDb = async (
    search: string = "",
    page: number = 1,
    limit: number = 5,
    sort: string = "createdAt_desc"
  ) => {
    const skip = (page - 1) * limit;

    let sortCriteria: Record<string, 1 | -1> = {};

    switch (sort) {
      case "createdAt_asc":
        sortCriteria.createdAt = 1;
        break;
      case "createdAt_desc":
        sortCriteria.createdAt = -1;
        break;
      case "price_asc":
        sortCriteria["productData.basePrice"] = 1;
        break;
      case "price_desc":
        sortCriteria["productData.basePrice"] = -1;
        break;
      default:
        sortCriteria.createdAt = -1;
    }

    const matchCriteria = search
      ? {
          $or: [
            { "productData.productName": { $regex: search, $options: "i" } },
            { "userData.firstName": { $regex: search, $options: "i" } },
            { "userData.lastName": { $regex: search, $options: "i" } },
            { "userData.userName": { $regex: search, $options: "i" } },
          ],
        }
      : {};
    const bidRequests = await AdminBidRequest.aggregate([
      {
        $lookup: {
          from: "products",
          localField: "bidProductId",
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
          localField: "bidderId",
          foreignField: "_id",
          as: "userData",
        },
      },
      {
        $unwind: "$userData",
      },
      {
        $match: matchCriteria,
      },
      {
        $project: {
          _id: 1,
          bidderId: 1,
          bidProductId: 1,
          createdAt: 1,
          updatedAt: 1,
          "productData._id": 1,
          "productData.productName": 1,
          "productData.basePrice": 1,
          "productData.productImageUrls": 1,
          "productData.category": 1,
          "productData.bidDuration": 1,
          "productData.subCategory": 1,
          "productData.isAdminAccepted": 1,
          "productData.bidEndTime": 1,
          "userData.firstName": 1,
          "userData.lastName": 1,
          "userData.email": 1,
          "userData.userName": 1,
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

    const totalBidRequests = await AdminBidRequest.aggregate([
      {
        $lookup: {
          from: "products",
          localField: "bidProductId",
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
          localField: "bidderId",
          foreignField: "_id",
          as: "userData",
        },
      },
      {
        $unwind: "$userData",
      },
      {
        $match: matchCriteria,
      },
      {
        $count: "total",
      },
    ]);
    const totalDocuments = totalBidRequests[0]?.total || 0;

    return {
      bidRequests,
      totalDocuments,
      currentPage: page,
    };
  };

  const getUserWiseBidRequests = async (userId: Types.ObjectId) => {
    console.log("user id getUserWiseBidRequests", userId);
    const userBidRequests = await AdminBidRequest.aggregate([
      {
        $match: {
          bidderId: userId,
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "bidProductId",
          foreignField: "_id",
          as: "productData",
        },
      },
      {
        $unwind: "$productData",
      },

      {
        $project: {
          _id: 1,
          bidderId: 1,
          bidProductId: 1,
          createdAt: 1,
          updatedAt: 1,
          "productData._id": 1,
          "productData.productName": 1,
          "productData.basePrice": 1,
          "productData.productImageUrls": 1,
          "productData.category": 1,
          "productData.bidDuration": 1,
          "productData.subCategory": 1,
          "productData.isAdminAccepted": 1,
          "productData.bidEndTime": 1,
          "userData.firstName": 1,
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
    ]);

    console.log("userBidRequests ", userBidRequests);

    return userBidRequests;
  };

  return {
    createBidRequestAdmin,
    getBidRequestsFromDb,
    getUserWiseBidRequests,
  };
};

export type AdminBidRequestMongoDb = typeof adminBidRequestMongoDb;
