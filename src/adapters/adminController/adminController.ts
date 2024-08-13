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
import {
  handleGetPostReports,
  handleGetProductPostAdmin,
} from "../../application/user-cases/product/get";
import { PostReportDbInterface } from "../../application/repositories/postReportRepository";
import { PostReportRepositoryMongoDb } from "../../frameworks/database/mongodb/repositories/postReportRepositoryMongoDb";
import { BidHistoryInterface } from "../../application/repositories/bidHistoryRepository";
import { BidHistoryRepositoryMongoDb } from "../../frameworks/database/mongodb/repositories/bidHistoryRepositoryMongoDb";
import {
  KycInterface,
  KycRepository,
} from "../../application/repositories/kycDbRepository";
import { KycRepositoryMongoDB } from "../../frameworks/database/mongodb/repositories/kycRepositoryMongoDB";
import {
  handleGetAdminStatistics,
  handleGetTransactionStastics,
} from "../../application/user-cases/dashboard/get";
import { BidService } from "../../frameworks/services/bidService";
import { BidServiceInterface } from "../../application/services/BidServiceInterface";
import { ScheduleServiceInterface } from "../../application/services/scheduleServiceInterface";
import { ScheduleService } from "../../frameworks/scheduler/scheduleService";
import { handleGetTransactionDetailsOfBidAdmin } from "../../application/user-cases/transactions/get";
import { TransactionInterface } from "../../application/repositories/transactionRepository";
import { TransactionRepositoryMongoDb } from "../../frameworks/database/mongodb/repositories/transactionRepositoryMongoDb";
import {
  handleChangeShipmentStatusToAdminRecieved,
  handleProductDeliveredToWinner,
  handleShipProductToBidWinner,
} from "../../application/user-cases/payment/update";
import { WalletInterface } from "../../application/repositories/walletRepository";
import { WalletRepositoryMongoDb } from "../../frameworks/database/mongodb/repositories/walletRepositoryMongoDb";
import {
  ExtendedAdminRequest,
  ExtendedRequest,
} from "../../types/extendedRequest";
import { CreateUserInterface } from "../../types/userInterface";

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
  kycRepositoryDbImpl: KycRepositoryMongoDB,
  bidServiceInterface: BidServiceInterface,
  bidService: BidService,
  scheduleServiceInterface: ScheduleServiceInterface,
  scheduleServiceImpl: ScheduleService,
  transactionRepository: TransactionInterface,
  transactionDbImpl: TransactionRepositoryMongoDb,
  walletRepository: WalletInterface,
  walletImpl: WalletRepositoryMongoDb
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
  const biddingService = bidServiceInterface(bidService());
  const scheduleServie = scheduleServiceInterface(scheduleServiceImpl());
  const dbTransaction = transactionRepository(transactionDbImpl());
  const dbWallet = walletRepository(walletImpl());

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
    console.log("query params ", req.query);
    const page =
      typeof req.query.page === "string" ? parseInt(req.query.page) : 1;
    const limit =
      typeof req.query.limit === "string" ? parseInt(req.query.limit) : 5;
    const searchQuery =
      typeof req.query.searchQuery === "string" ? req.query.searchQuery : "";
    console.log("search query ", searchQuery);

    const sort = typeof req.query.sort === "string" ? req.query.sort : "";
    console.log("sort ", sort);

    const { bidRequests, totalDocuments, currentPage } =
      await handleGetBidRequests(
        page,
        limit,
        searchQuery,
        sort,
        dbRepositoryAdminBidRequest
      );

    console.log("bid requests from mongo ", bidRequests);

    res.status(HttpStatusCodes.OK).json({
      success: true,
      message: "bid Requests retrived successfully",
      bidRequests,
      totalDocuments,
      currentPage,
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
      dbBidRepository,
      biddingService,
      scheduleServie
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
    console.log("query params ", req.query);
    const page =
      typeof req.query.page === "string" ? parseInt(req.query.page) : 1;
    const limit =
      typeof req.query.limit === "string" ? parseInt(req.query.limit) : 5;
    const searchQuery =
      typeof req.query.searchQuery === "string" ? req.query.searchQuery : "";
    console.log("search query ", searchQuery);

    const sort = typeof req.query.sort === "string" ? req.query.sort : "";
    console.log("sort ", sort);
    const { kycData, totalDocuments, currentPage } =
      await handleGetKycRequestsAdmin(
        page,
        limit,
        searchQuery,
        sort,
        dbKycRepository
      );

    res.status(HttpStatusCodes.OK).json({
      success: true,
      message: "kyc data retrived success",
      kycData,
      totalDocuments,
      currentPage,
    });
  });

  const changeKycRequestStatus = asyncHandler(
    async (req: Request, res: Response) => {
      const { kycId } = req.params;
      const { type } = req.body;
      const kycData = await handleKycRequestAdmin(kycId, type, dbKycRepository);

      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: "kyc handled successfully",
        kycData,
      });
    }
  );

  const getAllProductPostAdmin = asyncHandler(
    async (req: Request, res: Response) => {
      console.log("query params ", req.query);
      const page =
        typeof req.query.page === "string" ? parseInt(req.query.page) : 1;
      const limit =
        typeof req.query.limit === "string" ? parseInt(req.query.limit) : 5;
      const searchQuery =
        typeof req.query.searchQuery === "string" ? req.query.searchQuery : "";
      console.log("search query ", searchQuery);

      const sort = typeof req.query.sort === "string" ? req.query.sort : "";
      console.log("sort ", sort);

      const {
        products: productPosts,
        totalDocuments,
        currentPage,
      } = await handleGetProductPostAdmin(
        page,
        limit,
        searchQuery,
        sort,
        dbRepositoryProduct
      );

      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: "Product Posts Retrived successfully",
        productPosts,
        totalDocuments,
        currentPage,
      });
    }
  );

  const getDashboardStatistics = asyncHandler(
    async (req: Request, res: Response) => {
      const statistics = await handleGetAdminStatistics(
        dbRepositoryPostReport,
        dbRepositoryProduct,
        dbRepositoryUser
      );
      console.log("statistics ", statistics);

      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: "Dashboard statistics retrived successfully",
        statistics,
      });
    }
  );

  const getTransactionDetailsOfBidAdmin = asyncHandler(
    async (req: Request, res: Response) => {
      console.log("query params ", req.query);
      const page =
        typeof req.query.page === "string" ? parseInt(req.query.page) : 1;
      const limit =
        typeof req.query.limit === "string" ? parseInt(req.query.limit) : 5;
      const searchQuery =
        typeof req.query.searchQuery === "string" ? req.query.searchQuery : "";
      console.log("search query ", searchQuery);

      const sort = typeof req.query.sort === "string" ? req.query.sort : "";
      const shipmentStatus =
        typeof req.query.shipmentStatus === "string"
          ? req.query.shipmentStatus
          : "";
      const paymentStatus =
        typeof req.query.paymentStatus === "string"
          ? req.query.paymentStatus
          : "";
      const { transactions, totalDocuments, currentPage } =
        await handleGetTransactionDetailsOfBidAdmin(
          page,
          limit,
          searchQuery,
          sort,
          shipmentStatus,
          paymentStatus,
          dbBidRepository
        );

      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: "bid ended product transactions retrived success",
        transactions,
        totalDocuments,
        currentPage,
      });
    }
  );

  const adminRecievedTransactionChangeStatus = asyncHandler(
    async (req: Request, res: Response) => {
      const { trId } = req.params;
      const updatedTransaction =
        await handleChangeShipmentStatusToAdminRecieved(trId, dbTransaction);
      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: `transaction status updated to ${
          updatedTransaction.shipmentStatus
            ? updatedTransaction.shipmentStatus
            : "cant update"
        }`,
        updatedTransaction,
      });
    }
  );

  const shipProductToWinner = asyncHandler(
    async (req: Request, res: Response) => {
      const { trId } = req.params;
      const { winnerTrackingNumber } = req.body;
      const updatedTransaction = await handleShipProductToBidWinner(
        trId,
        winnerTrackingNumber,
        dbTransaction
      );
      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: `transaction status updated to ${
          updatedTransaction.shipmentStatus
            ? updatedTransaction.shipmentStatus
            : "cant update"
        }`,
        updatedTransaction,
      });
    }
  );

  const productDeliveredToWinner = asyncHandler(
    async (req: ExtendedAdminRequest, res: Response) => {
      const { trId } = req.params;
      const { productOwnerId, productId, bidId } = req.body;
      console.log("trId , productOwnerID", trId, " ", productOwnerId);

      const adminId = req.admin;
      console.log("admin id ", adminId);

      await handleProductDeliveredToWinner(
        trId,
        productId,
        bidId,
        adminId as string,
        productOwnerId,
        dbTransaction,
        dbWallet
      );

      res.status(HttpStatusCodes.OK).json({
        success: true,
        nessage: `transaction changed`,
      });
    }
  );

  const getTransactionStatistics = asyncHandler(
    async (req: ExtendedAdminRequest, res: Response) => {
      const { transactions, lastTransactions } =
        await handleGetTransactionStastics(dbTransaction);

      res.status(HttpStatusCodes.OK).json({
        success: true,
        nessage: `transaction statistics retirived`,
        transactions,
        lastTransactions,
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
    getAllProductPostAdmin,
    getDashboardStatistics,
    getTransactionDetailsOfBidAdmin,
    adminRecievedTransactionChangeStatus,
    shipProductToWinner,
    productDeliveredToWinner,
    getTransactionStatistics,
  };
};

export default adminController;
