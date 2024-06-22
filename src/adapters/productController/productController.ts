import { ProductRepositoryMongoDb } from "../../frameworks/database/mongodb/repositories/productRepositoryMongoDb";
import { ProductDbInterface } from "../../application/repositories/productDbRepository";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { HttpStatusCodes } from "../../types/httpStatusCodes";
import { CreateUserInterface } from "../../types/userInterface";
import {
  handlePostProduct,
  handleAddOrRemoveBookmark,
  // handleAddToBookmark,
  // handleRemoveFromBookmark,
} from "../../application/user-cases/product/update";
import { handleGetAllPosts } from "../../application/user-cases/product/get";
import { BookMarkDbInterface } from "../../application/repositories/bookmarkDbRepository";
import { BookmarkRepositoryMongoDb } from "../../frameworks/database/mongodb/repositories/bookmarkRepositoryMongoDb";


// import { BookmarkRepositoryMongoDb } from "../../frameworks/database/mongodb/repositories/bookmarkRepositoryMongoDb";

interface ExtendedRequest extends Request {
  user?: CreateUserInterface; // Replace with your actual user type
}
export const productController = (
  productDbRepository: ProductDbInterface,
  productDbImpl: ProductRepositoryMongoDb,
bookmarkRepository:BookMarkDbInterface,
bookmarkDbImpl:BookmarkRepositoryMongoDb
) => {
  const dbRepositoryProduct = productDbRepository(productDbImpl());
  const dbRepositoryBookmark = bookmarkRepository(bookmarkDbImpl());

  const productPost = asyncHandler(
    async (req: ExtendedRequest, res: Response) => {
      console.log("req.body productPost", req.body);
      const { _id } = req.user as CreateUserInterface;
      console.log("req user ", req.user);

      await handlePostProduct(req.body, _id, dbRepositoryProduct);

      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: "product posted success",
      });
    }
  );

  const getAllPosts = asyncHandler(
    async (req: ExtendedRequest, res: Response) => {
      const allPosts = await handleGetAllPosts(dbRepositoryProduct);

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

      console.log('id inside addOrRemoveBookmark ',_id);
      // await handleAddToBookmark(_id, postId,dbRepositoryBookmark);
      const result= await handleAddOrRemoveBookmark(_id, postId, dbRepositoryBookmark,dbRepositoryProduct);





      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: `bookmark ${result?.action} successfully`,
        action:result?.action
      });
    }
  );

  // const removeFromBookmark = asyncHandler(
  //   async (req: ExtendedRequest, res: Response) => {
  //     const { postId } = req.params;
  //     const { _id } = req.user as CreateUserInterface;
  //     // await handleRemoveFromBookmark(_id, postId,dbRepositoryBookmark);
  //     res.status(HttpStatusCodes.OK).json({
  //       success: true,
  //       message: "bookmark removed successfully",
  //     });
  //   }
  // );

  return {
    productPost,
    getAllPosts,
    addOrRemoveBookmark,
    // removeFromBookmark,
  };
};
