import mongoose from "mongoose";
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

    console.log("new bid request ", newBidRequest);

    return newBidRequest;
  };

  const getBidRequestsFromDb = async () => {
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
        $project: {
          _id: 1,
          bidderId: 1,
          bidProductId: 1,
          createdAt: 1,
          updatedAt: 1,
          "productData._id":1,
          "productData.productName": 1,
          "productData.basePrice": 1,
          "productData.productImageUrls": 1,
          "productData.category": 1,
          "productData.bidDuration": 1,
          "productData.subCategory": 1,
          "productData.isAdminAccepted":1,
          "productData.bidEndTime":1,
          "userData.firstName": 1,
          "userData.lastName": 1,
          "userData.email": 1,
          "userData.userName": 1,
        },
      },
      {
        $sort:{
          createdAt:-1
        }
      }
    ]);

    console.log(bidRequests);

    console.log("bidRequests ", bidRequests);

    return bidRequests;
  };

//  const acceptBidRequest=async(requestId:string)=>{
 
//   await AdminBidRequest.findByIdAndUpdate(requestId,{$set:{isAccepted:true}})
 
//  }



  return {
    createBidRequestAdmin,
    getBidRequestsFromDb,
    // acceptBidRequest
  };
};

export type AdminBidRequestMongoDb = typeof adminBidRequestMongoDb;
