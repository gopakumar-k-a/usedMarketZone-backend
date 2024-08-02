import Product, { IProduct } from "../models/productModel";
import { PostEntityType } from "../../../../entities/createProductPostEntity";
import { BidPostEntityType } from "../../../../entities/createBidPostEntity";
import mongoose, { Types } from "mongoose";
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
  const postBid = async (bid: BidPostEntityType) => {
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
          isDeactivatedPost: false,
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
        $lookup: {
          from: "bids",
          localField: "bidData",
          foreignField: "_id",
          as: "bidDetails",
        },
      },
      {
        $unwind: {
          path: "$bidDetails",
          preserveNullAndEmptyArrays: true, // Preserve products without bids
        },
      },

      {
        $addFields: {
          currentHighestBid: "$bidDetails.currentHighestBid",
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
          currentHighestBid: 1,
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
    // const postDetails = await Product.findOne({ _id: postId });
    // console.log("post Details getUserPostDetails", postDetails);
    const products = await Product.aggregate([
      {
        $match: {
          _id: new Types.ObjectId(postId),
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
        $lookup: {
          from: "bids",
          localField: "bidData",
          foreignField: "_id",
          as: "bidDetails",
        },
      },
      {
        $unwind: {
          path: "$bidDetails",
          preserveNullAndEmptyArrays: true, // Preserve products without bids
        },
      },

      {
        $addFields: {
          currentHighestBid: "$bidDetails.currentHighestBid",
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
          currentHighestBid: 1,
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
          isDeactivatedPost: 1,
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
          createdAt: 1,
          isBidding: 1,
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
    ]);

    if (!postsListImages) {
      throw new AppError("Invalid Post Id", HttpStatusCodes.BAD_GATEWAY);
    }

    return postsListImages;
  };

  const getUserPostDetails = async (userId: string, postId: string) => {
    console.log("user id ", userId);
    console.log("product id ", postId);

    const products: IProduct[] = await Product.aggregate<IProduct>([
      {
        $match: {
          _id: new ObjectId(postId),
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
          isDeactivatedPost: 1,
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
    ]);
    // console.log('products ',products);

    if (!products) {
      throw new AppError("invalid product id ", HttpStatusCodes.BAD_REQUEST);
    }
    return products;
  };
  const updateProduct = async (productId: string, update: IProduct) => {
    const updatedProduct = await Product.findByIdAndUpdate(productId, update, {
      new: true,
    });
    return updatedProduct;
  };

  const blockProductByAdmin = async (productId: string) => {
    // const blockProduct=await Product.findByIdAndUpdate(productId,{isBlocked:!isBlocked})
    const product = await Product.findById(productId);

    if (!product) {
      throw new AppError("Invalid Product Id ", HttpStatusCodes.BAD_REQUEST);
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { isBlocked: !product.isBlocked },
      { new: true }
    );

    return updatedProduct?.isBlocked;
  };

  const deactivateProductSellPost = async (
    userId: string,
    productId: string
  ) => {
    const productSellPost = await Product.findOne({
      _id: productId,
      userId,
      isBidding: false,
    });
    if (!productSellPost) {
      throw new AppError(
        "no Product Found Check the Product Id",
        HttpStatusCodes.BAD_REQUEST
      );
    }
    productSellPost.isDeactivatedPost = !productSellPost.isDeactivatedPost;

    await productSellPost.save();
    return productSellPost.isDeactivatedPost;
  };

  const searchProduct = async (
    query: string,
    isBidding: boolean,
    userId: Types.ObjectId
  ) => {
    console.log(`    query: ${query},
    isBidding: ${isBidding},`);

    const regex = new RegExp(query.trim(), "i");
    // const results = await Product.find(
    //   {
    //     isBidding: isBidding,
    //     $or: [
    //       { description: regex },
    //       { productName: regex },
    //       { category: regex },
    //       { subCategory: regex },
    //     ],
    //     // role: "user",
    //     isAdminAccepted: true,

    //   },
    //   {
    //     productName: 1,
    //     basePrice: 1,
    //     userId: 1,
    //     isSold: 1,
    //     isBlocked: 1,
    //     category: 1,
    //     subCategory: 1,
    //     productImageUrls: 1,
    //     address: 1,
    //     createdAt: 1,
    //     bidEndTime: 1,
    //     isBidding: 1,
    //     isDeactivatedPost: 1,
    //   }
    // )

    const results = await Product.aggregate([
      {
        $match: {
          isBidding: isBidding,
          $or: [
            { description: regex },
            { productName: regex },
            { category: regex },
            { subCategory: regex },
          ],
          // role: "user",
          isAdminAccepted: true,
          isDeactivatedPost: false,
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
        $lookup: {
          from: "bids",
          localField: "bidData",
          foreignField: "_id",
          as: "bidDetails",
        },
      },
      {
        $unwind: {
          path: "$bidDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          currentHighestBid: "$bidDetails.currentHighestBid",
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
          currentHighestBid: 1,
          isSold: 1,
          isBlocked: 1,
          isDeactivatedPost: 1,
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
    ]);

    console.log("searchProduct results ", results);
    // console.log("produts ", products);

    // return products;
    return results;
  };

  const getUserBids = async (userId: Types.ObjectId) => {
    const userBids = await Product.find(
      {
        userId: userId,
        isBidding: true,
      },
      {
        productName: 1,
        basePrice: 1,
        productImageUrls: 1,
        category: 1,
        bidDuration: 1,
        subCategory: 1,
        isAdminAccepted: 1,
        bidEndTime: 1,
      }
    ).sort({ createdAt: -1 });

    console.log("user bids getUserBids product mongodb", userBids);

    return userBids;
  };

  const getAllProductPostAdmin = async () => {
    const products = await Product.aggregate([
      {
        $match: {
          isAdminAccepted: true,
          isDeactivatedPost: false,
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
        $lookup: {
          from: "bids",
          localField: "bidData",
          foreignField: "_id",
          as: "bidDetails",
        },
      },
      {
        $unwind: {
          path: "$bidDetails",
          preserveNullAndEmptyArrays: true, // Preserve products without bids
        },
      },

      {
        $addFields: {
          currentHighestBid: "$bidDetails.currentHighestBid",
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
          currentHighestBid: 1,
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

  const getNumberOfProducts = async () => {
    const [result] = await Product.aggregate([
      {
        $facet: {
          numberOfProducts: [{ $count: "totalProducts" }],
          numberOfBidProducts: [
            { $match: { isBidding: true } },
            { $count: "totalBidProducts" },
          ],
          numberOfNonBidProducts: [
            { $match: { isBidding: false } },
            { $count: "totalNonBidProducts" },
          ],
        },
      },
      {
        $project: {
          numberOfProducts: {
            $arrayElemAt: ["$numberOfProducts.totalProducts", 0],
          },
          numberOfBidProducts: {
            $arrayElemAt: ["$numberOfBidProducts.totalBidProducts", 0],
          },
          numberOfNonBidProducts: {
            $arrayElemAt: ["$numberOfNonBidProducts.totalNonBidProducts", 0],
          },
        },
      },
    ]);

    console.log("result ", result);

    // Return default values if counts are missing
    return {
      numberOfProducts: result?.numberOfProducts || 0,
      numberOfBidProducts: result?.numberOfBidProducts || 0,
      numberOfNonBidProducts: result?.numberOfNonBidProducts || 0,
    };
  };

 

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
    updateProduct,
    blockProductByAdmin,
    deactivateProductSellPost,
    searchProduct,
    getUserBids,
    getAllProductPostAdmin,
    getNumberOfProducts,
  };
};

export type ProductRepositoryMongoDb = typeof productRepositoryMongoDb;
