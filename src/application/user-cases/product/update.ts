import { BidDuration, ProductPostForm } from "../../../types/product";
import postEntity from "../../../entities/createProductPostEntity";
import bidEntity from "../../../entities/createBidPostEntity";
import { ProductDbInterface } from "../../repositories/productDbRepository";
import { BookMarkDbInterface } from "../../repositories/bookmarkDbRepository";
// import {BookMarkDbInterface}  from "../../repositories/bookmarkDbRepository";
import { AdminBidRequestDbInterface } from "../../repositories/adminBidRequestDbRepository";
import AppError from "../../../utils/appError";
import { HttpStatusCodes } from "../../../types/httpStatusCodes";
import { CommentDbRepository } from "../../repositories/commentRepository";
import { commentEntity } from "../../../entities/createCommentEntity";
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

  const createBidEntity = bidEntity(
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

  console.log("createPostEntity ", createBidEntity);

  const newBid = await productRepository.postBid(createBidEntity);
  // console.log(newBid.userId, newBid._id);
  const newBidRequest=await adminBidRequestRepository.createBidRequestAdmin(newBid._id as string,newBid.userId as string)

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


export const handleAdminAcceptedBid=async(bidProductId:string, bidDuration:BidDuration, productRepository: ReturnType<ProductDbInterface>)=>{

  const updatedBidProduct=await productRepository.updateAdminAcceptBidStatus(bidProductId,bidDuration)
 
  if(!updatedBidProduct){
    throw new AppError("check bid product Id , no Product Found ",HttpStatusCodes.BAD_GATEWAY)
  }

  return true
}
export const handleReplyComment = async (
  commentData: {
    content: string;
    postId: string;
    parentCommentId:string;
  },
  authorId: string,
  commentRepository: CommentDbRepository
) => {

  console.log('comment data handleReplyComment',commentData);
  
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
 
  

  const newComment = await commentRepository.submitReplyComment(createCommentEntity);

  return newComment;
};
