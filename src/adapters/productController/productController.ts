import { ProductRepositoryMongoDb } from "../../frameworks/database/mongodb/repositories/productRepositoryMongoDb";
import { ProductDbInterface } from "../../application/repositories/productDbRepository";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { HttpStatusCodes } from "../../types/httpStatusCodes";
import { CreateUserInterface } from "../../types/userInterface";
import {
  handlePostProduct,
  handleAddOrRemoveBookmark,
  handleProductBidPost,
  handleReplyComment,
  handleDeactivateSellProductPost,
} from "../../application/user-cases/product/update";
import {
  handleGetAllPostComments,
  handleGetAllPosts,
  handleGetCommentReplies,
  handleGetOwnerPostsImageList,
  handleGetPostDetails,
} from "../../application/user-cases/product/get";
import { BookMarkDbInterface } from "../../application/repositories/bookmarkDbRepository";
import { BookmarkRepositoryMongoDb } from "../../frameworks/database/mongodb/repositories/bookmarkRepositoryMongoDb";
import { ExtendedRequest } from "../../types/extendedRequest";
import {
  handleAddComment,
  handlePostReportSubmit,
} from "../../application/user-cases/product/create";
import { PostReportDbInterface } from "../../application/repositories/postReportRepository";
import { PostReportRepositoryMongoDb } from "../../frameworks/database/mongodb/repositories/postReportRepositoryMongoDb";
import { CommentDbInterface } from "../../application/repositories/commentRepository";
import { CommentRepositoryMongoDb } from "../../frameworks/database/mongodb/repositories/commentRepositoryMongoDb";
import { handleDeleteComment } from "../../application/user-cases/product/delete";
import { handleGetBookmarkImageList } from "../../application/user-cases/bookmarks/get";
import { BidHistoryInterface } from "../../application/repositories/bidHistoryRepository";
import { BidHistoryRepositoryMongoDb } from "../../frameworks/database/mongodb/repositories/bidHistoryRepositoryMongoDb";
import { BidInterface } from "../../application/repositories/bidRepository";
import { BidRepositoryMongoDb } from "../../frameworks/database/mongodb/repositories/bidRepositoryMongoDb";

export const productController = (
  productDbRepository: ProductDbInterface,
  productDbImpl: ProductRepositoryMongoDb,
  bookmarkRepository: BookMarkDbInterface,
  bookmarkDbImpl: BookmarkRepositoryMongoDb,
  productReportRepository: PostReportDbInterface,
  productReportDbImpl: PostReportRepositoryMongoDb,
  commentRepository: CommentDbInterface,
  commentDbImpl: CommentRepositoryMongoDb,
  bidHistoryRepository: BidHistoryInterface,
  bidHistoryImpl: BidHistoryRepositoryMongoDb,
  bidRepository: BidInterface,
  bidImpl: BidRepositoryMongoDb
) => {
  const dbRepositoryProduct = productDbRepository(productDbImpl());
  const dbRepositoryBookmark = bookmarkRepository(bookmarkDbImpl());
  const dbProductReport = productReportRepository(productReportDbImpl());
  const dbRepositoryComment = commentRepository(commentDbImpl());
  const dbBidHistory = bidHistoryRepository(bidHistoryImpl());
  const dbBid = bidRepository(bidImpl());

  const productPost = asyncHandler(
    async (req: ExtendedRequest, res: Response) => {
      const { _id } = req.user as CreateUserInterface;

      await handlePostProduct(req.body, _id, dbRepositoryProduct);

      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: "product posted success",
      });
    }
  );

  const getAllPosts = asyncHandler(
    async (req: ExtendedRequest, res: Response) => {
      const { _id } = req.user as CreateUserInterface;
      const allPosts = await handleGetAllPosts(_id, dbRepositoryProduct);

      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: "user posts retrived success",
        allPosts,
      });
    }
  );

  const addOrRemoveBookmark = asyncHandler(
    async (req: ExtendedRequest, res: Response) => {
      const { postId } = req.params;
      const { _id } = req.user as CreateUserInterface;

      const result = await handleAddOrRemoveBookmark(
        _id,
        postId,
        dbRepositoryBookmark,
        dbRepositoryProduct
      );

      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: `bookmark ${result?.action} successfully`,
        action: result?.action,
      });
    }
  );

  const reportPost = asyncHandler(
    async (req: ExtendedRequest, res: Response) => {
      const { _id } = req.user as CreateUserInterface;

      console.log("report post body ", req.body);

      await handlePostReportSubmit(_id, req.body, dbProductReport);
      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: "report submitted successfully",
      });
    }
  );

  const getOwnerPostsImageList = asyncHandler(
    async (req: ExtendedRequest, res: Response) => {
      const { _id } = req.user as CreateUserInterface;
      const ownerPostsImageList = await handleGetOwnerPostsImageList(
        _id,
        dbRepositoryProduct
      );

      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: "owner post image list retrived successfully",
        ownerPostsImageList,
      });
    }
  );

  const getPostDetails = asyncHandler(
    async (req: ExtendedRequest, res: Response) => {
      const { postId } = req.params;
      const { _id } = req.user as CreateUserInterface;

      const postDetails = await handleGetPostDetails(
        _id,
        postId,
        dbRepositoryProduct,
        dbBidHistory,
        dbBid
      );

      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: "owner post image list retrived successfully",
        postDetails,
      });
    }
  );

  const addComment = asyncHandler(
    async (req: ExtendedRequest, res: Response) => {
      const { _id } = req.user as CreateUserInterface;

      const newCommentData = await handleAddComment(
        req.body,
        _id,
        dbRepositoryComment
      );
      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: "comment added successfully",
        newCommentData,
      });
    }
  );
  const replyComment = asyncHandler(
    async (req: ExtendedRequest, res: Response) => {
      const { _id } = req.user as CreateUserInterface;

      const newCommentData = await handleReplyComment(
        req.body,
        _id,
        dbRepositoryComment
      );
      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: "comment replied successfully",
        newCommentData,
      });
    }
  );

  const getAllPostComments = asyncHandler(
    async (req: ExtendedRequest, res: Response) => {
      const { postId } = req.params;

      const commentData = await handleGetAllPostComments(
        postId,
        dbRepositoryComment
      );
      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: "comment data retrived successfully",
        commentData,
      });
    }
  );
  const getCommentReply = asyncHandler(
    async (req: ExtendedRequest, res: Response) => {
      const { commentId } = req.params;

      const replyData = await handleGetCommentReplies(
        commentId,
        dbRepositoryComment
      );
      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: "comment reply data retrived successfully",
        replyData,
      });
    }
  );

  const deleteComment = asyncHandler(
    async (req: ExtendedRequest, res: Response) => {
      await handleDeleteComment(req.body, dbRepositoryComment);

      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: "comment deleted successfully",
      });
    }
  );

  const getBookmarkImageList = asyncHandler(
    async (req: ExtendedRequest, res: Response) => {
      const { _id } = req.user as CreateUserInterface;

      const bookmarkImageList = await handleGetBookmarkImageList(
        _id,
        dbRepositoryBookmark
      );

      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: "bookmark image List Retrived successfully",
        bookmarkImageList,
      });
    }
  );

  const deActivatePost = asyncHandler(
    async (req: ExtendedRequest, res: Response) => {
      const { _id: userId } = req.user as CreateUserInterface;

      const { postId } = req.params;
      const isDeactivatedPost = await handleDeactivateSellProductPost(
        userId,
        postId,
        dbRepositoryProduct
      );

      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: `product ${
          isDeactivatedPost ? "de-activated" : "activated"
        } successfully`,
        isDeactivatedPost,
      });
    }
  );

  return {
    productPost,
    getAllPosts,
    addOrRemoveBookmark,
    reportPost,
    getOwnerPostsImageList,
    getPostDetails,
    addComment,
    getAllPostComments,
    replyComment,
    getCommentReply,
    deleteComment,
    getBookmarkImageList,
    deActivatePost,
  };
};
