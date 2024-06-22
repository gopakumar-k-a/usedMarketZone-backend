import { ProductRepositoryMongoDb } from "../../frameworks/database/mongodb/repositories/productRepositoryMongoDb";
import { ProductDbRepository } from "../../application/repositories/productDbRepository";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { HttpStatusCodes } from "../../types/httpStatusCodes";
import { CreateUserInterface } from "../../types/userInterface";
import { handlePostProduct } from "../../application/user-cases/product/update";
import { handleGetAllPosts } from "../../application/user-cases/product/get";

interface ExtendedRequest extends Request {
  user?: CreateUserInterface; // Replace with your actual user type
}
export const productController = (
  productDbRepository: ProductDbRepository,
  productDbImpl: ProductRepositoryMongoDb
) => {
  const dbRepositoryProduct = productDbRepository(productDbImpl());

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
        success:true,
        message:"user posts retrived success",
        allPosts
      })
    }
  );

  return {
    productPost,
    getAllPosts,
  };
};
