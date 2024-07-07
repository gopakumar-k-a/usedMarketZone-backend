import Product from "../models/productModel";
import { PostEntityType } from "../../../../entities/createProductPostEntity";
import { BidEntityType } from "../../../../entities/createBidPostEntity";
import mongoose from "mongoose";
import { BidDuration } from "../../../../types/product";
import { HttpStatusCodes } from "../../../../types/httpStatusCodes";
import AppError from "../../../../utils/appError";
const { ObjectId } = mongoose.Types;

export const productRepositoryMongoDb = () => {
  const postProduct = async (product: PostEntityType) => {
    const productData = {
      productName: product.getProductName(),
      basePrice: product.getBasePrice(),
      userId: product.getUserId(),
      productImageUrls: product.getProductImageUrls(),
      category: product.getCategory(),
      subCategory: product.getSubCategory(),
      phone: product.getPhone(),
      description: product.getDescription(),
      productCondition: product.getProductCondition(),
      address: product.getAddress(),
      productAge: product.getProductAge(),
      isAdminAccepted: true,
    };

    // Save to the database
    const newProduct = new Product(productData);
    console.log("newProduct ", newProduct);

    await newProduct.save();

    return newProduct;
  };
  const postBid = async (bid: BidEntityType) => {
    console.log("bid duration in mongo ", bid.getBidDuration());

    const bidData = {
      productName: bid.getProductName(),
      basePrice: bid.getBasePrice(),
      userId: bid.getUserId(),
      productImageUrls: bid.getProductImageUrls(),
      category: bid.getCategory(),
      subCategory: bid.getSubCategory(),
      phone: bid.getPhone(),
      description: bid.getDescription(),
      productCondition: bid.getProductCondition(),
      address: bid.getAddress(),
      productAge: bid.getProductAge(),
      isBidding: true,
      bidDuration: bid.getBidDuration(),
    };

    // Save to the database
    const newProduct = new Product(bidData);
    console.log("newProduct ", newProduct);

    await newProduct.save();

    return newProduct;
  };

  const getAllProductPost = async (userId: string) => {
    const products = await Product.aggregate([
      {
        $match: {
          isAdminAccepted: true,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: "$userDetails",
      },
      {
        $addFields: {
          isBookmarked: { $in: [userId, "$bookmarkedUsers"] },
        },
      },
      {
        $project: {
          _id: 1,
          productName: 1,
          basePrice: 1,
          userId: 1,
          productImageUrls: 1,
          category: 1,
          subCategory: 1,
          phone: 1,
          description: 1,
          productCondition: 1,
          productAge: 1,
          bookmarkedCount: 1,
          address: 1,
          "userDetails.userName": 1,
          "userDetails.imageUrl": 1,
          isBookmarked: 1,
          createdAt: 1,
          isBidding: 1,
          bidEndTime: 1,
          bidAcceptedTime: 1,
    
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
    ]);

    console.log("products ", products);

    return products;
  };

  const addUserToProductBookmark = async (
    userId: string,
    productId: string
  ) => {
    const productData = Product.findById(productId);

    if (productData) {
      await productData.updateOne(
        { productId },
        { $push: { bookmarkedUsers: userId } }
      );
      return true;
    }

    return false;
  };

  const removeUserFromProductBookmark = async (
    userId: string,
    productId: string
  ) => {
    const productData = Product.findById(productId);

    if (productData) {
      await productData.updateOne(
        { productId },
        { $pull: { bookmarkedUsers: userId } }
      );
      return true;
    }

    return false;
  };

  const updateProductBookmarkCount = async (
    productId: string,
    action: string
  ) => {
    let updatedProduct;
    if (action == "inc") {
      updatedProduct = await Product.findOneAndUpdate(
        { _id: productId },
        { $inc: { bookmarkedCount: 1 } },
        { new: true }
      );
    } else if (action == "dec") {
      updatedProduct = await Product.findOneAndUpdate(
        { _id: productId },
        { $inc: { bookmarkedCount: -1 } },
        { new: true }
      );
    } else {
      return false;
    }

    if (!updatedProduct) {
      return false;
    }

    console.log("Bookmark count increased successfully");
    return updatedProduct;
  };

  const getUserPosts = async (userId: string) => {
    console.log("user id ", userId);

    const userPosts = await Product.aggregate([
      { $match: { userId: new ObjectId(userId) } },
      {
        $project: {
          productName: 1,
          basePrice: 1,
          userId: 1,
          isSold: 1,
          isBlocked: 1,
          category: 1,
          subCategory: 1,
          productImageUrls: 1,
          address: 1,
          createdAt: 1,
          bidEndTime: 1,
          isBidding: 1,
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
    ]);
    // const userPosts=await Product.find({userId})

    console.log("user posts ", userPosts);

    if (!userPosts) {
      return false;
    }

    return userPosts;
  };

  const getUserPostDetailsAdmin = async (postId: string) => {
    const postDetails = await Product.findOne({ _id: postId });
    console.log('post Details getUserPostDetails',postDetails);
    

    
    if (!postDetails) {
      return false;
    }
    return postDetails;
  };

  const updateAdminAcceptBidStatus = async (
    bidProductId: string,
    bidDuration: BidDuration
  ) => {
    const bidAcceptedTime = new Date();

    const bidEndTime = new Date(
      bidAcceptedTime.getTime() +
        bidDuration.day * 24 * 60 * 60 * 1000 +
        bidDuration.hour * 60 * 60 * 1000 +
        bidDuration.minute * 60 * 1000
    );

    const updatedBid = await Product.findByIdAndUpdate(
      bidProductId,
      {
        $set: { isAdminAccepted: true, bidEndTime, bidAcceptedTime },
      },
      { new: true }
    );

    console.log("updateAdminAcceptBidStatus updated bid is ", updatedBid);

    return updatedBid;
  };

  const getAllUserPosts = async () => {
    const userPosts = await Product.aggregate([
      {
        $project: {
          productName: 1,
          basePrice: 1,
          userId: 1,
          isSold: 1,
          isBlocked: 1,
          category: 1,
          subCategory: 1,
          productImageUrls: 1,
          address: 1,
          createdAt: 1,
          bidEndTime: 1,
          isBidding: 1,
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
    ]);

    return userPosts;
  };

  const getOwnerPostsImageList = async (ownerId: string) => {
    const postsListImages = await Product.aggregate([
      {
        $match: {
          userId: ownerId,
          isAdminAccepted: true,
        },
      },
      {
        $project: {
          productImageUrls: 1,
        },
      },
      {
        $sort:{
          createdAt:-1
        }
      }
    ]);

    if (!postsListImages) {
      throw new AppError("Invalid Post Id", HttpStatusCodes.BAD_GATEWAY);
    }

    return postsListImages;
  };

  const getUserPostDetails=async(userId:string,postId:string)=>{
    console.log('user id ',userId);
    console.log('product id ',postId);
    
    
    const products = await Product.aggregate([
      {
        $match: {
          _id:new ObjectId(postId),
          isAdminAccepted: true,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: "$userDetails",
      },
      {
        $addFields: {
          isBookmarked: { $in: [userId, "$bookmarkedUsers"] },
        },
      },
      {
        $project: {
          _id: 1,
          productName: 1,
          basePrice: 1,
          userId: 1,
          productImageUrls: 1,
          category: 1,
          subCategory: 1,
          phone: 1,
          description: 1,
          productCondition: 1,
          productAge: 1,
          bookmarkedCount: 1,
          address: 1,
          "userDetails.userName": 1,
          "userDetails.imageUrl": 1,
          isBookmarked: 1,
          createdAt: 1,
          isBidding: 1,
          bidEndTime: 1,
          bidAcceptedTime: 1,
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
    ]);
    // console.log('products ',products);

    if(!products){
      throw new AppError("invalid product id ",HttpStatusCodes.BAD_REQUEST)
    }
    return products
  }


  return {
    postProduct,
    getAllProductPost,
    addUserToProductBookmark,
    removeUserFromProductBookmark,
    updateProductBookmarkCount,
    getUserPosts,
    getUserPostDetailsAdmin,
    postBid,
    updateAdminAcceptBidStatus,
    getAllUserPosts,
    getOwnerPostsImageList,
    getUserPostDetails,
  };
};

export type ProductRepositoryMongoDb = typeof productRepositoryMongoDb;
