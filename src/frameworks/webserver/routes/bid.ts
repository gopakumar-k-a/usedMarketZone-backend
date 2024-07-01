import express from "express";
import { productDbRepository } from "../../../application/repositories/productDbRepository";
import { productRepositoryMongoDb } from "../../database/mongodb/repositories/productRepositoryMongoDb";
// import { productController } from "../../../adapters/productController/productController";
import { bidController } from "../../../adapters/bidController/bidController";
import { bookmarkRepositoryMongoDb } from "../../database/mongodb/repositories/bookmarkRepositoryMongoDb";
import { bookmarkDbRepository } from "../../../application/repositories/bookmarkDbRepository";
import { adminBidRequestMongoDb } from "../../database/mongodb/repositories/adminBidRequestRepositoryMongoDb";
import { adminBidRequestDb } from "../../../application/repositories/adminBidRequestDbRepository";
const bidRouter = () => {
  const router = express.Router();
  const controller = bidController(
    productDbRepository,
    productRepositoryMongoDb,
    bookmarkDbRepository,
    bookmarkRepositoryMongoDb,
    adminBidRequestDb,
    adminBidRequestMongoDb
  );

  router.post("/post-bid",controller.productBidPost)

//   router.patch("/bookmark-post/remove/:postId", controller.removeFromBookmark);

  return router;
};

export default bidRouter;
