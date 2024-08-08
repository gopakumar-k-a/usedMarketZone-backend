import { BidDuration, ProductPostForm } from "../../../types/product";
import postEntity from "../../../entities/createProductPostEntity";
import bidPostEntity from "../../../entities/createBidPostEntity";
import {
  ProductDbInterface,
} from "../../repositories/productDbRepository";
import { BookMarkDbInterface } from "../../repositories/bookmarkDbRepository";
// import {BookMarkDbInterface}  from "../../repositories/bookmarkDbRepository";
import { AdminBidRequestDbInterface } from "../../repositories/adminBidRequestDbRepository";
import AppError from "../../../utils/appError";
import { HttpStatusCodes } from "../../../types/httpStatusCodes";
import { CommentDbRepository } from "../../repositories/commentRepository";
import { commentEntity } from "../../../entities/createCommentEntity";
import {  BidRepository } from "../../repositories/bidRepository";
import { createBidEntity } from "../../../entities/bidding/createBidEntity";
import mongoose from "mongoose";
import { BidServiceInterface } from "../../services/BidServiceInterface";
import { ScheduleServiceInterface } from "../../services/scheduleServiceInterface";
import { bidQueue } from "../../../frameworks/scheduler/bidQueue";
import { BidHistoryInterface } from "../../repositories/bidHistoryRepository";
// import schedule from 'node-schedule';

export const handlePostProduct = async (
  postData: ProductPostForm,
  userId: string,
  productRepository: ReturnType<ProductDbInterface>
) => {
  const {
    productName,
    basePrice,
    productImageUrls,
    category,
    subCategory,
    phone,
    description,
    productCondition,
    address,
    productAge,
  } = postData;

  const createPostEntity = postEntity(
    productName,
    basePrice,
    userId,
    productImageUrls,
    category,
    subCategory,
    phone,
    description,
    productCondition,
    address,
    productAge
  );

  console.log("createPostEntity ", createPostEntity);

  await productRepository.postProduct(createPostEntity);
  return;
};
export const handleProductBidPost = async (
  bidData: ProductPostForm,
  userId: string,
  productRepository: ReturnType<ProductDbInterface>,
  adminBidRequestRepository: ReturnType<AdminBidRequestDbInterface>
  // bidRepository: BidRepository
) => {
  const {
    productName,
    basePrice,
    productImageUrls,
    category,
    subCategory,
    phone,
    description,
    productCondition,
    address,
    productAge,
    bidDuration,
  } = bidData;

  const createBidPostEntity = bidPostEntity(
    productName,
    basePrice,
    userId,
    productImageUrls,
    category,
    subCategory,
    phone,
    description,
    productCondition,
    address,
    productAge,
    bidDuration
  );

  console.log("createPostEntity ", bidPostEntity);

  const newBidPost = await productRepository.postBid(createBidPostEntity);
  // productId: mongoose.Schema.Types.ObjectId,
  // userId: mongoose.Schema.Types.ObjectId,
  // baseBidPrice: string,
  // // currentHighestBid: number,
  // bidEndTime: string

  if (!newBidPost) {
    throw new AppError("failed to post ", HttpStatusCodes.BAD_GATEWAY);
  }

  // const newBidData=await bidRepository.addBidAfterAdminAccept()
  // console.log(newBid.userId, newBid._id);
  const newBidRequest = await adminBidRequestRepository.createBidRequestAdmin(
    String(newBidPost._id),
    String(newBidPost.userId)
  );

  // console.log('new bid request ',newBidRequest);

  return;
};

export const handleAddOrRemoveBookmark = async (
  userId: string,
  postId: string,
  bookmarkRepository: ReturnType<BookMarkDbInterface>,
  productRepository: ReturnType<ProductDbInterface>
) => {
  const bookmark = await bookmarkRepository.findUserBookmarks(userId);
  console.log("bookmark is ", bookmark);

  if (!bookmark) {
    await Promise.all([
      bookmarkRepository.addPostToUserBookmarks(userId, postId),
      productRepository.addUserToProductBookmark(userId, postId),
      productRepository.updateProductBookmarkCount(postId, "inc"),
    ]);
    return { action: "added" };
  }

  if (Array.isArray(bookmark.postIds)) {
    const isBookmarked = bookmark.postIds.includes(postId);

    if (isBookmarked) {
      await Promise.all([
        bookmarkRepository.removePostFromUserBookmarks(userId, postId),
        productRepository.removeUserFromProductBookmark(userId, postId),
        productRepository.updateProductBookmarkCount(postId, "dec"),
      ]);
      return { action: "removed" };
    } else {
      await Promise.all([
        bookmarkRepository.addPostToUserBookmarks(userId, postId),
        productRepository.addUserToProductBookmark(userId, postId),
        productRepository.updateProductBookmarkCount(postId, "inc"),
      ]);
      return { action: "added" };
    }
  } else {
    console.error("Unexpected format for bookmark.postIds:", bookmark.postIds);
    return { action: "error" };
  }
};

export const handleAdminAcceptedBid = async (
  bidProductId: string,
  bidDuration: BidDuration,
  productRepository: ReturnType<ProductDbInterface>,
  bidRepository: BidRepository,
  bidService: ReturnType<BidServiceInterface>,
  scheduleService: ReturnType<ScheduleServiceInterface>
) => {
  const updatedBidProduct = await productRepository.updateAdminAcceptBidStatus(
    bidProductId,
    bidDuration
  );

  if (!updatedBidProduct) {
    throw new AppError(
      "check bid product Id , no Product Found ",
      HttpStatusCodes.BAD_GATEWAY
    );
  }
  // const newBidEntity=createBidEntity(productId: updatedBidProduct._id as mongoose.Schema.Types.ObjectId ,userId:updatedBidProduct.userId as mongoose.Schema.Types.ObjectId,baseBidPrice:updatedBidProduct.basePrice,bidEndTime:String(updatedBidProduct.bidAcceptedTime)   )
  const newBidEntity = createBidEntity(
    updatedBidProduct._id as mongoose.Schema.Types.ObjectId,
    updatedBidProduct.userId as mongoose.Schema.Types.ObjectId,
    String(updatedBidProduct.basePrice),
    String(updatedBidProduct.bidEndTime)
  );

  const newlyAddedBid = await bidRepository.addBidAfterAdminAccept(
    newBidEntity
  );
  updatedBidProduct.bidData = newlyAddedBid._id;
  await productRepository.updateProduct(bidProductId, updatedBidProduct);

  const delay = new Date(updatedBidProduct.bidEndTime).getTime() - Date.now();


bidQueue.add('closebid',{bidId:newlyAddedBid._id,productId:newlyAddedBid.productId},{delay:delay})
  return true;
};
export const handleReplyComment = async (
  commentData: {
    content: string;
    postId: string;
    parentCommentId: string;
  },
  authorId: string,
  commentRepository: CommentDbRepository
) => {
  console.log("comment data handleReplyComment", commentData);

  // content:string,
  // authorId:string,
  // postId:string,
  // parentCommentId:string|null=null
  const createCommentEntity = commentEntity(
    commentData.content,
    authorId,
    commentData.postId,
    commentData.parentCommentId
  );

  const newComment = await commentRepository.submitReplyComment(
    createCommentEntity
  );

  return newComment;
};

export const handleBlockProductByAdmin = async (
  productId: string,
  productRepository: ReturnType<ProductDbInterface>
) => {
  const currentProductStatus = await productRepository.blockProductByAdmin(
    productId
  );

  return currentProductStatus;
};

export const handleDeactivateSellProductPost = async (
  userId: string,
  productId: string,
  productRepository: ReturnType<ProductDbInterface>
) => {
  const productActiveStatus = await productRepository.deactivateProductSellPost(
    userId,
    productId
  );

  return productActiveStatus;
};
