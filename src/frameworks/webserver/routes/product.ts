import express from "express";
import { productDbRepository } from "../../../application/repositories/productDbRepository";
import { productRepositoryMongoDb } from "../../database/mongodb/repositories/productRepositoryMongoDb";
import { productController } from "../../../adapters/productController/productController";
import { bookmarkRepositoryMongoDb } from "../../database/mongodb/repositories/bookmarkRepositoryMongoDb";
import { bookmarkDbRepository } from "../../../application/repositories/bookmarkDbRepository";
import { postReportRepositoryMongoDb } from "../../database/mongodb/repositories/postReportRepositoryMongoDb";
import { postReportDbRepository } from "../../../application/repositories/postReportRepository";
import { commentRepositoryMongoDb } from "../../database/mongodb/repositories/commentRepositoryMongoDb";
import { commentDbRepository } from "../../../application/repositories/commentRepository";
import { bidHistoryRepository } from "../../../application/repositories/bidHistoryRepository";
import { bidHistoryRepositoryMongoDb } from "../../database/mongodb/repositories/bidHistoryRepositoryMongoDb";
import { bidDbRepository } from "../../../application/repositories/bidRepository";
import { bidRepositoryMongoDb } from "../../database/mongodb/repositories/bidRepositoryMongoDb";
const productRouter = () => {
  const router = express.Router();
  const controller = productController(
    productDbRepository,
    productRepositoryMongoDb,
    bookmarkDbRepository,
    bookmarkRepositoryMongoDb,
    postReportDbRepository,
    postReportRepositoryMongoDb,
    commentDbRepository,
    commentRepositoryMongoDb,
    bidHistoryRepository,
    bidHistoryRepositoryMongoDb,
    bidDbRepository,
    bidRepositoryMongoDb
  );

  router.post("/post-product", controller.productPost);
  router.get("/get-all-products-posts", controller.getAllPosts);
  router.patch("/bookmark-post/:postId", controller.addOrRemoveBookmark);
  router.post("/report-post",controller.reportPost)
  router.get("/owner/get-image-list",controller.getOwnerPostsImageList)
  router.get("/owner/get-bookmark-list",controller.getBookmarkImageList)
  router.get("/get-post-details/:postId",controller.getPostDetails)
  router.post("/add-comment",controller.addComment)
  router.patch("/reply-comment",controller.replyComment)
  router.get("/get-post-comments/:postId",controller.getAllPostComments)
  router.get("/get-comment-reply/:commentId",controller.getCommentReply)
  router.delete("/delete-comment",controller.deleteComment)
  router.patch("/deactivate-post/:postId",controller.deActivatePost)

  return router;
};

export default productRouter;
