import mongoose from "mongoose";
import { HttpStatusCodes } from "../../../types/httpStatusCodes";
import AppError from "../../../utils/appError";
import { BidHistoryInterface } from "../../repositories/bidHistoryRepository";
import { CommentDbInterface } from "../../repositories/commentRepository";
import { PostReportDbRepository } from "../../repositories/postReportRepository";
import { ProductDbInterface } from "../../repositories/productDbRepository";
import { IProduct } from "../../../frameworks/database/mongodb/models/productModel";
import { BidInterface } from "../../repositories/bidRepository";

export const handleGetAllPosts = async (
  userId: string,
  productRepository: ReturnType<ProductDbInterface>
) => {
  const products = await productRepository.getAllProductPost(userId);

  return products;
};

export const handleGetOwnerPostsImageList = async (
  ownerId: string,
  productRepository: ReturnType<ProductDbInterface>
) => {
  const ownerPostsImageList = await productRepository.getOwnerPostsImageList(
    ownerId
  );

  return ownerPostsImageList;
};

export const handleGetPostDetails = async (
  userId: string,
  postId: string,
  productRepository: ReturnType<ProductDbInterface>,
  bidHistoryRepository: ReturnType<BidHistoryInterface>,
  bidRepository: ReturnType<BidInterface>
) => {
  let postDetails = await productRepository.getUserPostDetails(userId, postId);

  if (!postDetails) {
    throw new AppError("Invalid Post Id", HttpStatusCodes.BAD_GATEWAY);
  }
  if (postDetails[0].isBidding) {
    const [previousBidSumOfUser, bidData] = await Promise.all([
      bidHistoryRepository.getUserPreviousBidsSumOnProduct(
        new mongoose.Types.ObjectId(userId),
        postDetails[0]._id as mongoose.Types.ObjectId
      ),

      bidRepository.getBidDetails(String(postDetails[0]._id)),
    ]);

    interface IProductWithBidSum extends IProduct {
      previousBidSumOfUser: number;
      currentHighestBid: number;
    }

    postDetails = postDetails.map((post) => ({
      ...post,
      ...(previousBidSumOfUser.length > 0 && {
        previousBidSumOfUser: previousBidSumOfUser[0].previousBidSumOfBidder,
      }),
      ...(bidData && { currentHighestBid: bidData.currentHighestBid }),
    })) as IProductWithBidSum[];
  }


  return postDetails;
};

export const handleGetAllPostComments = async (
  postId: string,
  commentRepository: ReturnType<CommentDbInterface>
) => {
  const commentData = await commentRepository.getAllComments(postId);
  return commentData;
};

export const handleGetCommentReplies = async (
  parentCommentId: string,
  commentRepository: ReturnType<CommentDbInterface>
) => {
  const replyData = await commentRepository.getReplyData(parentCommentId);
  return replyData;
};

export const handleGetPostReports = async (
  reportRepository: PostReportDbRepository
) => {
  const postReportData = await reportRepository.getReports();
  return postReportData;
};

export const handleGetProductPostAdmin = async (
  page: number = 1,
  limit: number = 5,
  searchQuery: string = "",
  sort: string = "",
  productRepository: ReturnType<ProductDbInterface>
) => {
  const { products, totalDocuments, currentPage } =
    await productRepository.getAllProductPostAdmin(
      page,
      limit,
      searchQuery,
      sort
    );

  return { products, totalDocuments, currentPage };
};
