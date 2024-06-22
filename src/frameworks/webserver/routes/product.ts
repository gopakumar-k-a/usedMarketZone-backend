import express from "express";
import { productDbRepository } from "../../../application/repositories/productDbRepository";
import { productRepositoryMongoDb } from "../../database/mongodb/repositories/productRepositoryMongoDb";
import { productController } from "../../../adapters/productController/productController";
import { bookmarkRepositoryMongoDb } from "../../database/mongodb/repositories/bookmarkRepositoryMongoDb";
import { bookmarkDbRepository } from "../../../application/repositories/bookmarkDbRepository";
const productRouter = () => {
  const router = express.Router();
  const controller = productController(
    productDbRepository,
    productRepositoryMongoDb,
    bookmarkDbRepository,
    bookmarkRepositoryMongoDb
  );

  router.post("/post-product", controller.productPost);
  router.get("/get-all-products-posts", controller.getAllPosts);
  router.patch("/bookmark-post/:postId", controller.addOrRemoveBookmark);
//   router.patch("/bookmark-post/remove/:postId", controller.removeFromBookmark);

  return router;
};

export default productRouter;
