import { HttpStatusCodes } from "../../../types/httpStatusCodes";
import AppError from "../../../utils/appError";
import { CommentDbInterface } from "../../repositories/commentRepository";
import { PostReportDbRepository } from "../../repositories/postReportRepository";
import { ProductDbInterface } from "../../repositories/productDbRepository";

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
  console.log("owner post image list ", ownerPostsImageList);

  return ownerPostsImageList;
};

export const handleGetPostDetails = async (
  userId: string,
  postId: string,
  productRepository: ReturnType<ProductDbInterface>
) => {
  const postDetails = await productRepository.getUserPostDetails(
    userId,
    postId
  );
  console.log("handleGetPostDetails postDetails ", postDetails);

  if (!postDetails) {
    throw new AppError("Invalid Post Id", HttpStatusCodes.BAD_GATEWAY);
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
