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
import {
  handleAddClaimerAddress,
  handlePlaceBid,
} from "../../application/user-cases/bid/update";
import {
  handleGetBidDetailsOfUserOnProduct,
  handleGetBidResultForOwner,
  handleGetClaimProductDetails,
  handleGetMyParticipatingBids,
  handleGetUserWiseBidRequests,
} from "../../application/user-cases/bid/get";
import { KycInterface } from "../../application/repositories/kycDbRepository";
import { KycRepositoryMongoDB } from "../../frameworks/database/mongodb/repositories/kycRepositoryMongoDB";
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
  bidHistoryDbImpl: BidHistoryRepositoryMongoDb,
  kycRepositoryDb: KycInterface,
  kycRepositoryImpl: KycRepositoryMongoDB
) => {
  const dbRepositoryProduct = productDbRepository(productDbImpl());
  // const dbRepositoryBookmark = bookmarkRepository(bookmarkDbImpl());
  const dbRepositoryAdminBidRequest = adminBidRequestDbRepository(
    adminBidRequestDbImpl()
  );

  const dbBidRepository = bidRepositoryDb(bidRepositoryDbImpl());
  const dbBidHistoryRepository = bidHistroryDbRepository(bidHistoryDbImpl());

  const dbKycRepository = kycRepositoryDb(kycRepositoryImpl());

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
    const { bidAmount } = req.body;
    const { bidProductId } = req.params;

    const totalBidAmount = await handlePlaceBid(
      _id,
      bidProductId,
      bidAmount,
      dbBidRepository,
      dbBidHistoryRepository,
      dbKycRepository
    );

    res.status(HttpStatusCodes.OK).json({
      success: true,
      message: "bid placed successfully",
      totalBidAmount,
    });
  });

  const getBidDetailsOfUserOnProduct = asyncHandler(
    async (req: ExtendedRequest, res: Response) => {
      const { _id } = req.user as CreateUserInterface;
      const { bidProductId } = req.params;

      const bidHistory = await handleGetBidDetailsOfUserOnProduct(
        _id,
        bidProductId,
        dbBidHistoryRepository
      );

      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: "bid History Retrived successfully",
        bidHistory,
      });
    }
  );

  const getUserBids = asyncHandler(
    async (req: ExtendedRequest, res: Response) => {
      const { _id: userId } = req.user as CreateUserInterface;
      const userBids = await handleGetUserWiseBidRequests(
        userId,
        dbRepositoryAdminBidRequest,
        dbRepositoryProduct
      );

      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: "bid Requests Retrived Successfully",
        userBids,
      });
    }
  );

  const getMyParticipatingBids = asyncHandler(
    async (req: ExtendedRequest, res: Response) => {
      const { _id: userId } = req.user as CreateUserInterface;

      const userParticipatingBids = await handleGetMyParticipatingBids(
        userId,
        dbBidHistoryRepository
      );

      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: "user participating bids retrived Successfully",
        userParticipatingBids,
      });
    }
  );

  const getClaimBidDetails = asyncHandler(
    async (req: ExtendedRequest, res: Response) => {
      const { _id: userId } = req.user as CreateUserInterface;
      const { productId } = req.params;

      const bidData = await handleGetClaimProductDetails(
        userId,
        productId,
        dbBidHistoryRepository
      );

      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: "claimable bid data retrived successfully",
        bidData,
      });
    }
  );

  const addBidClaimerAddress = asyncHandler(
    async (req: ExtendedRequest, res: Response) => {
      const { bidId } = req.params;

      const newAddress = await handleAddClaimerAddress(
        bidId,
        req.body,
        dbBidRepository
      );
      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: "Claimer Address added successfully",
        newAddress,
      });
    }
  );

  const getBidResultForOwner = asyncHandler(
    async (req: ExtendedRequest, res: Response) => {
      const { _id: userId } = req.user as CreateUserInterface;
      const { productId } = req.params;
      console.log('productId ',productId);
      
      const bidResult = await handleGetBidResultForOwner(
        productId,
        userId,
        dbBidRepository
      );

      console.log('bidResult is ',bidResult);
      
      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: "Bid Result retrived success",
        bidResult,
      });
    }
  );

  return {
    productBidPost,
    placeBid,
    getBidDetailsOfUserOnProduct,
    getUserBids,
    getMyParticipatingBids,
    getClaimBidDetails,
    addBidClaimerAddress,
    getBidResultForOwner,
  };
};
