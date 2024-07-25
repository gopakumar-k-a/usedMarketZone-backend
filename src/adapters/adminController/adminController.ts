import asyncHandler from "express-async-handler";
import { UserDbInterface } from "../../application/repositories/userDbRepository";
import { UserRepositoryMongoDb } from "../../frameworks/database/mongodb/repositories/userRepositoryMongoDb";
import { Request, Response } from "express";
import { HttpStatusCodes } from "../../types/httpStatusCodes";
import {
  getAllUsers,
  getUserProfile,
  handleGetKycRequestsAdmin,
  handleGetUserPostDetails,
  handleGetUserPosts,
} from "../../application/user-cases/user/read";
import {
  handleKycRequestAdmin,
  modifyUserAccess,
} from "../../application/user-cases/user/update";
import { ProductDbInterface } from "../../application/repositories/productDbRepository";
import { ProductRepositoryMongoDb } from "../../frameworks/database/mongodb/repositories/productRepositoryMongoDb";
import { AdminBidRequestDbInterface } from "../../application/repositories/adminBidRequestDbRepository";
import { AdminBidRequestMongoDb } from "../../frameworks/database/mongodb/repositories/adminBidRequestRepositoryMongoDb";
import {
  handleAdminGetBidHistoryOfProduct,
  handleGetBidRequests,
} from "../../application/user-cases/bid/get";
import {
  handleAdminAcceptedBid,
  handleBlockProductByAdmin,
} from "../../application/user-cases/product/update";
import { BidInterface } from "../../application/repositories/bidRepository";
import { BidRepositoryMongoDb } from "../../frameworks/database/mongodb/repositories/bidRepositoryMongoDb";
import { handleGetPostReports } from "../../application/user-cases/product/get";
import { PostReportDbInterface } from "../../application/repositories/postReportRepository";
import { PostReportRepositoryMongoDb } from "../../frameworks/database/mongodb/repositories/postReportRepositoryMongoDb";
import { BidHistoryInterface } from "../../application/repositories/bidHistoryRepository";
import { BidHistoryRepositoryMongoDb } from "../../frameworks/database/mongodb/repositories/bidHistoryRepositoryMongoDb";
import {
  KycInterface,
  KycRepository,
} from "../../application/repositories/kycDbRepository";
import { KycRepositoryMongoDB } from "../../frameworks/database/mongodb/repositories/kycRepositoryMongoDB";

const adminController = (
  userDbRepository: UserDbInterface,
  userDbImpl: UserRepositoryMongoDb,
  productDbRepository: ProductDbInterface,
  productDbImpl: ProductRepositoryMongoDb,
  adminBidRequestDbRepository: AdminBidRequestDbInterface,
  adminBidRequestDbImpl: AdminBidRequestMongoDb,
  bidRepository: BidInterface,
  bidRepositoryImpl: BidRepositoryMongoDb,
  postReportRepository: PostReportDbInterface,
  postReportRepositoryImpl: PostReportRepositoryMongoDb,
  bidHistoryRepository: BidHistoryInterface,
  bidHistoryImpl: BidHistoryRepositoryMongoDb,
  kycRepository: KycInterface,
  kycRepositoryDbImpl: KycRepositoryMongoDB
) => {
  const dbRepositoryUser = userDbRepository(userDbImpl());
  const dbRepositoryProduct = productDbRepository(productDbImpl());
  const dbRepositoryAdminBidRequest = adminBidRequestDbRepository(
    adminBidRequestDbImpl()
  );
  const dbBidRepository = bidRepository(bidRepositoryImpl());
  const dbRepositoryPostReport = postReportRepository(
    postReportRepositoryImpl()
  );
  const dbBidHistory = bidHistoryRepository(bidHistoryImpl());
  const dbKycRepository = kycRepository(kycRepositoryDbImpl());

  const handleGetUsers = asyncHandler(async (req: Request, res: Response) => {
    // console.log("inside admin controller ", req.params);
    console.log("inside admin controller");

    const page = parseInt(req.params.page) || 1;
    const limit = parseInt(req.params.limit) || 10;
    const startIndex = (page - 1) * limit;

    const { users, totalDocuments } = await getAllUsers(
      startIndex,
      limit,
      dbRepositoryUser
    );

    console.log("users get in get users ", users);
    console.log("total documents in get users ", totalDocuments);

    // const user/

    res.status(HttpStatusCodes.OK).send({
      success: true,
      message: "getting user data success",
      userData: users,
      totalDocuments,
    });
  });

  const handleModifyUserAccess = asyncHandler(
    async (req: Request, res: Response) => {
      const { userId } = req.params;

      const updatedUser = await modifyUserAccess(userId, dbRepositoryUser);
      console.log("updatedUser handleModifyUserAccess", updatedUser);

      res.status(HttpStatusCodes.OK).send({
        success: true,
        message: "changed user access",
        updatedUser,
      });
    }
  );

  const getUserProfileDetails = asyncHandler(
    async (req: Request, res: Response) => {
      const { userId } = req.params;
      const userData = await getUserProfile(userId, dbRepositoryUser);

      res.status(HttpStatusCodes.OK).json({
        status: "success",
        message: "User Details has been feteched",
        userData,
      });
    }
  );

  const getUserPosts = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;

    const userPosts = await handleGetUserPosts(userId, dbRepositoryProduct);

    res.status(HttpStatusCodes.OK).json({
      success: true,
      message: "user posts retrived successfully",
      userPosts,
    });
  });

  const getUserPostDetails = asyncHandler(
    async (req: Request, res: Response) => {
      const { postId } = req.params;
      const postDetails = await handleGetUserPostDetails(
        postId,
        dbRepositoryProduct
      );

      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: "user post details retrived successfully",
        postDetails,
      });
    }
  );

  const getBidRequests = asyncHandler(async (req: Request, res: Response) => {
    const bidRequests = await handleGetBidRequests(dbRepositoryAdminBidRequest);

    console.log("bid requests from mongo ", bidRequests);

    res.status(HttpStatusCodes.OK).json({
      success: true,
      message: "bid Requests retrived successfully",
      bidRequests,
    });
  });

  const acceptBidRequest = asyncHandler(async (req: Request, res: Response) => {
    const { bidProductId } = req.params;
    const { bidDuration } = req.body;
    console.log(req.body, "acceptBidRequest req.body ");

    const isUpdated = await handleAdminAcceptedBid(
      bidProductId,
      bidDuration,
      dbRepositoryProduct,
      dbBidRepository
    );

    res.status(HttpStatusCodes.OK).json({
      success: true,
      message: "bid accept success",
      isUpdated,
    });
  });

  const getPostReports = asyncHandler(async (req: Request, res: Response) => {
    const postReports = await handleGetPostReports(dbRepositoryPostReport);

    res.status(HttpStatusCodes.OK).json({
      success: true,
      message: "post reports retrived success",
      postReports,
    });
  });

  const adminBlockPost = asyncHandler(async (req: Request, res: Response) => {
    const { productId } = req.params;

    const productIsBlocked = await handleBlockProductByAdmin(
      productId,
      dbRepositoryProduct
    );
    res.status(HttpStatusCodes.OK).json({
      success: true,
      message: `post ${
        productIsBlocked ? "blocked" : "un-blocked"
      } successfully`,
      productIsBlocked,
    });
  });

  const getBidHistoryOfProduct = asyncHandler(
    async (req: Request, res: Response) => {
      const { bidProductId } = req.params;

      const bidHistory = await handleAdminGetBidHistoryOfProduct(
        bidProductId,
        dbBidHistory
      );

      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: "bid history retrieved succesfully",
        bidHistory,
      });
    }
  );

  const getKycRequests = asyncHandler(async (req: Request, res: Response) => {
    const kycData = await handleGetKycRequestsAdmin(dbKycRepository);

    res.status(HttpStatusCodes.OK).json({
      success: true,
      message: "kyc data retrived success",
      kycData,
    });
  });

  const changeKycRequestStatus = asyncHandler(
    async (req: Request, res: Response) => {
      const { kycId } = req.params;
      const { type } = req.body;
      const kycData = await handleKycRequestAdmin(
        kycId,
        type,
        dbKycRepository
      );

      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: "kyc handled successfully",
        kycData,
      });
    }
  );
  return {
    handleGetUsers,
    handleModifyUserAccess,
    getUserProfileDetails,
    getUserPosts,
    getUserPostDetails,
    getBidRequests,
    acceptBidRequest,
    getPostReports,
    adminBlockPost,
    getBidHistoryOfProduct,
    getKycRequests,
    changeKycRequestStatus,
  };
};

export default adminController;
