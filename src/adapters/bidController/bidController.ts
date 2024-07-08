import { ProductRepositoryMongoDb } from "../../frameworks/database/mongodb/repositories/productRepositoryMongoDb";
import { ProductDbInterface } from "../../application/repositories/productDbRepository";
import asyncHandler from "express-async-handler";
import { Response } from "express";
import { HttpStatusCodes } from "../../types/httpStatusCodes";
import { CreateUserInterface } from "../../types/userInterface";
import {
  handleAdminAcceptedBid,
  handleProductBidPost,
  // handleAddToBookmark,
  // handleRemoveFromBookmark,
} from "../../application/user-cases/product/update";
import { BookMarkDbInterface } from "../../application/repositories/bookmarkDbRepository";
import { BookmarkRepositoryMongoDb } from "../../frameworks/database/mongodb/repositories/bookmarkRepositoryMongoDb";
import { ExtendedRequest } from "../../types/extendedRequest";
import { AdminBidRequestDbInterface } from "../../application/repositories/adminBidRequestDbRepository";
import { AdminBidRequestMongoDb } from "../../frameworks/database/mongodb/repositories/adminBidRequestRepositoryMongoDb";
import { BidInterface } from "../../application/repositories/bidRepository";
import { BidRepositoryMongoDb } from "../../frameworks/database/mongodb/repositories/bidRepositoryMongoDb";
import { BidHistoryInterface } from "../../application/repositories/bidHistoryRepository";
import { BidHistoryRepositoryMongoDb } from "../../frameworks/database/mongodb/repositories/bidHistoryRepositoryMongoDb";
import { handlePlaceBid } from "../../application/user-cases/bid/update";
export const bidController = (
  productDbRepository: ProductDbInterface,
  productDbImpl: ProductRepositoryMongoDb,
  // bookmarkRepository: BookMarkDbInterface,
  // bookmarkDbImpl: BookmarkRepositoryMongoDb,
  adminBidRequestDbRepository: AdminBidRequestDbInterface,
  adminBidRequestDbImpl: AdminBidRequestMongoDb,
  bidRepositoryDb: BidInterface,
  bidRepositoryDbImpl: BidRepositoryMongoDb,
  bidHistroryDbRepository: BidHistoryInterface,
  bidHistoryDbImpl: BidHistoryRepositoryMongoDb
) => {
  const dbRepositoryProduct = productDbRepository(productDbImpl());
  // const dbRepositoryBookmark = bookmarkRepository(bookmarkDbImpl());
  const dbRepositoryAdminBidRequest = adminBidRequestDbRepository(
    adminBidRequestDbImpl()
  );

  const dbBidRepository = bidRepositoryDb(bidRepositoryDbImpl());
  const dbBidHistoryRepository = bidHistroryDbRepository(bidHistoryDbImpl());

  const productBidPost = asyncHandler(
    async (req: ExtendedRequest, res: Response) => {
      console.log("req.body productPost", req.body);
      const { _id } = req.user as CreateUserInterface;
      console.log("req user ", req.user);

      await handleProductBidPost(
        req.body,
        _id,
        dbRepositoryProduct,
        dbRepositoryAdminBidRequest
        // dbBidRepository
      );

      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: "product posted success",
      });
    }
  );

  const placeBid = asyncHandler(async (req: ExtendedRequest, res: Response) => {
    const { _id } = req.user as CreateUserInterface;
    const {  bidAmount } = req.body;
    const {bidProductId}=req.params

    await handlePlaceBid(
      _id,
      bidProductId,
      bidAmount,
      dbBidRepository,
      dbBidHistoryRepository
    );

    res.status(HttpStatusCodes.OK).json({
      success: true,
      message: "bid placed successfully",
    });
  });

  return {
    productBidPost,
    placeBid,
  };
};
