"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const httpStatusCodes_1 = require("../../types/httpStatusCodes");
const read_1 = require("../../application/user-cases/user/read");
const update_1 = require("../../application/user-cases/user/update");
const get_1 = require("../../application/user-cases/bid/get");
const update_2 = require("../../application/user-cases/product/update");
const get_2 = require("../../application/user-cases/product/get");
const get_3 = require("../../application/user-cases/dashboard/get");
const get_4 = require("../../application/user-cases/transactions/get");
const update_3 = require("../../application/user-cases/payment/update");
const adminController = (userDbRepository, userDbImpl, productDbRepository, productDbImpl, adminBidRequestDbRepository, adminBidRequestDbImpl, bidRepository, bidRepositoryImpl, postReportRepository, postReportRepositoryImpl, bidHistoryRepository, bidHistoryImpl, kycRepository, kycRepositoryDbImpl, bidServiceInterface, bidService, scheduleServiceInterface, scheduleServiceImpl, transactionRepository, transactionDbImpl, walletRepository, walletImpl) => {
    const dbRepositoryUser = userDbRepository(userDbImpl());
    const dbRepositoryProduct = productDbRepository(productDbImpl());
    const dbRepositoryAdminBidRequest = adminBidRequestDbRepository(adminBidRequestDbImpl());
    const dbBidRepository = bidRepository(bidRepositoryImpl());
    const dbRepositoryPostReport = postReportRepository(postReportRepositoryImpl());
    const dbBidHistory = bidHistoryRepository(bidHistoryImpl());
    const dbKycRepository = kycRepository(kycRepositoryDbImpl());
    const biddingService = bidServiceInterface(bidService());
    const scheduleServie = scheduleServiceInterface(scheduleServiceImpl());
    const dbTransaction = transactionRepository(transactionDbImpl());
    const dbWallet = walletRepository(walletImpl());
    const handleGetUsers = (0, express_async_handler_1.default)(async (req, res) => {
        const page = parseInt(req.params.page) || 1;
        const limit = parseInt(req.params.limit) || 10;
        const startIndex = (page - 1) * limit;
        const { users, totalDocuments } = await (0, read_1.getAllUsers)(startIndex, limit, dbRepositoryUser);
        res.status(httpStatusCodes_1.HttpStatusCodes.OK).send({
            success: true,
            message: "getting user data success",
            userData: users,
            totalDocuments,
        });
    });
    const handleModifyUserAccess = (0, express_async_handler_1.default)(async (req, res) => {
        const { userId } = req.params;
        const updatedUser = await (0, update_1.modifyUserAccess)(userId, dbRepositoryUser);
        res.status(httpStatusCodes_1.HttpStatusCodes.OK).send({
            success: true,
            message: "changed user access",
            updatedUser,
        });
    });
    const getUserProfileDetails = (0, express_async_handler_1.default)(async (req, res) => {
        const { userId } = req.params;
        const userData = await (0, read_1.getUserProfile)(userId, dbRepositoryUser);
        res.status(httpStatusCodes_1.HttpStatusCodes.OK).json({
            status: "success",
            message: "User Details has been feteched",
            userData,
        });
    });
    const getUserPosts = (0, express_async_handler_1.default)(async (req, res) => {
        const { userId } = req.params;
        const userPosts = await (0, read_1.handleGetUserPosts)(userId, dbRepositoryProduct);
        res.status(httpStatusCodes_1.HttpStatusCodes.OK).json({
            success: true,
            message: "user posts retrived successfully",
            userPosts,
        });
    });
    const getUserPostDetails = (0, express_async_handler_1.default)(async (req, res) => {
        const { postId } = req.params;
        const postDetails = await (0, read_1.handleGetUserPostDetails)(postId, dbRepositoryProduct);
        res.status(httpStatusCodes_1.HttpStatusCodes.OK).json({
            success: true,
            message: "user post details retrived successfully",
            postDetails,
        });
    });
    const getBidRequests = (0, express_async_handler_1.default)(async (req, res) => {
        const page = typeof req.query.page === "string" ? parseInt(req.query.page) : 1;
        const limit = typeof req.query.limit === "string" ? parseInt(req.query.limit) : 5;
        const searchQuery = typeof req.query.searchQuery === "string" ? req.query.searchQuery : "";
        const sort = typeof req.query.sort === "string" ? req.query.sort : "";
        const { bidRequests, totalDocuments, currentPage } = await (0, get_1.handleGetBidRequests)(page, limit, searchQuery, sort, dbRepositoryAdminBidRequest);
        res.status(httpStatusCodes_1.HttpStatusCodes.OK).json({
            success: true,
            message: "bid Requests retrived successfully",
            bidRequests,
            totalDocuments,
            currentPage,
        });
    });
    const acceptBidRequest = (0, express_async_handler_1.default)(async (req, res) => {
        const { bidProductId } = req.params;
        const { bidDuration } = req.body;
        const isUpdated = await (0, update_2.handleAdminAcceptedBid)(bidProductId, bidDuration, dbRepositoryProduct, dbBidRepository);
        res.status(httpStatusCodes_1.HttpStatusCodes.OK).json({
            success: true,
            message: "bid accept success",
            isUpdated,
        });
    });
    const getPostReports = (0, express_async_handler_1.default)(async (req, res) => {
        const postReports = await (0, get_2.handleGetPostReports)(dbRepositoryPostReport);
        res.status(httpStatusCodes_1.HttpStatusCodes.OK).json({
            success: true,
            message: "post reports retrived success",
            postReports,
        });
    });
    const adminBlockPost = (0, express_async_handler_1.default)(async (req, res) => {
        const { productId } = req.params;
        const productIsBlocked = await (0, update_2.handleBlockProductByAdmin)(productId, dbRepositoryProduct);
        res.status(httpStatusCodes_1.HttpStatusCodes.OK).json({
            success: true,
            message: `post ${productIsBlocked ? "blocked" : "un-blocked"} successfully`,
            productIsBlocked,
        });
    });
    const getBidHistoryOfProduct = (0, express_async_handler_1.default)(async (req, res) => {
        const { bidProductId } = req.params;
        const bidHistory = await (0, get_1.handleAdminGetBidHistoryOfProduct)(bidProductId, dbBidHistory);
        res.status(httpStatusCodes_1.HttpStatusCodes.OK).json({
            success: true,
            message: "bid history retrieved succesfully",
            bidHistory,
        });
    });
    const getKycRequests = (0, express_async_handler_1.default)(async (req, res) => {
        const page = typeof req.query.page === "string" ? parseInt(req.query.page) : 1;
        const limit = typeof req.query.limit === "string" ? parseInt(req.query.limit) : 5;
        const searchQuery = typeof req.query.searchQuery === "string" ? req.query.searchQuery : "";
        const sort = typeof req.query.sort === "string" ? req.query.sort : "";
        const { kycData, totalDocuments, currentPage } = await (0, read_1.handleGetKycRequestsAdmin)(page, limit, searchQuery, sort, dbKycRepository);
        res.status(httpStatusCodes_1.HttpStatusCodes.OK).json({
            success: true,
            message: "kyc data retrived success",
            kycData,
            totalDocuments,
            currentPage,
        });
    });
    const changeKycRequestStatus = (0, express_async_handler_1.default)(async (req, res) => {
        const { kycId } = req.params;
        const { type } = req.body;
        const kycData = await (0, update_1.handleKycRequestAdmin)(kycId, type, dbKycRepository);
        res.status(httpStatusCodes_1.HttpStatusCodes.OK).json({
            success: true,
            message: "kyc handled successfully",
            kycData,
        });
    });
    const getAllProductPostAdmin = (0, express_async_handler_1.default)(async (req, res) => {
        const page = typeof req.query.page === "string" ? parseInt(req.query.page) : 1;
        const limit = typeof req.query.limit === "string" ? parseInt(req.query.limit) : 5;
        const searchQuery = typeof req.query.searchQuery === "string" ? req.query.searchQuery : "";
        const sort = typeof req.query.sort === "string" ? req.query.sort : "";
        const { products: productPosts, totalDocuments, currentPage, } = await (0, get_2.handleGetProductPostAdmin)(page, limit, searchQuery, sort, dbRepositoryProduct);
        res.status(httpStatusCodes_1.HttpStatusCodes.OK).json({
            success: true,
            message: "Product Posts Retrived successfully",
            productPosts,
            totalDocuments,
            currentPage,
        });
    });
    const getDashboardStatistics = (0, express_async_handler_1.default)(async (req, res) => {
        const statistics = await (0, get_3.handleGetAdminStatistics)(dbRepositoryPostReport, dbRepositoryProduct, dbRepositoryUser);
        res.status(httpStatusCodes_1.HttpStatusCodes.OK).json({
            success: true,
            message: "Dashboard statistics retrived successfully",
            statistics,
        });
    });
    const getTransactionDetailsOfBidAdmin = (0, express_async_handler_1.default)(async (req, res) => {
        const page = typeof req.query.page === "string" ? parseInt(req.query.page) : 1;
        const limit = typeof req.query.limit === "string" ? parseInt(req.query.limit) : 5;
        const searchQuery = typeof req.query.searchQuery === "string" ? req.query.searchQuery : "";
        const sort = typeof req.query.sort === "string" ? req.query.sort : "";
        const shipmentStatus = typeof req.query.shipmentStatus === "string"
            ? req.query.shipmentStatus
            : "";
        const paymentStatus = typeof req.query.paymentStatus === "string"
            ? req.query.paymentStatus
            : "";
        const fromDate = typeof req.query.fromDate == "string" ? req.query.fromDate : "";
        const toDate = typeof req.query.toDate == "string" ? req.query.toDate : "";
        const { transactions, totalDocuments, currentPage } = await (0, get_4.handleGetTransactionDetailsOfBidAdmin)(page, limit, searchQuery, sort, shipmentStatus, paymentStatus, fromDate, toDate, dbBidRepository);
        res.status(httpStatusCodes_1.HttpStatusCodes.OK).json({
            success: true,
            message: "bid ended product transactions retrived success",
            transactions,
            totalDocuments,
            currentPage,
        });
    });
    const adminRecievedTransactionChangeStatus = (0, express_async_handler_1.default)(async (req, res) => {
        const { trId } = req.params;
        const updatedTransaction = await (0, update_3.handleChangeShipmentStatusToAdminRecieved)(trId, dbTransaction);
        res.status(httpStatusCodes_1.HttpStatusCodes.OK).json({
            success: true,
            message: `transaction status updated to ${updatedTransaction.shipmentStatus
                ? updatedTransaction.shipmentStatus
                : "cant update"}`,
            updatedTransaction,
        });
    });
    const shipProductToWinner = (0, express_async_handler_1.default)(async (req, res) => {
        const { trId } = req.params;
        const { winnerTrackingNumber } = req.body;
        const updatedTransaction = await (0, update_3.handleShipProductToBidWinner)(trId, winnerTrackingNumber, dbTransaction);
        res.status(httpStatusCodes_1.HttpStatusCodes.OK).json({
            success: true,
            message: `transaction status updated to ${updatedTransaction.shipmentStatus
                ? updatedTransaction.shipmentStatus
                : "cant update"}`,
            updatedTransaction,
        });
    });
    const productDeliveredToWinner = (0, express_async_handler_1.default)(async (req, res) => {
        const { trId } = req.params;
        const { productOwnerId, productId, bidId } = req.body;
        const adminId = req.admin;
        await (0, update_3.handleProductDeliveredToWinner)(trId, productId, bidId, adminId, productOwnerId, dbTransaction, dbWallet);
        res.status(httpStatusCodes_1.HttpStatusCodes.OK).json({
            success: true,
            nessage: `transaction changed`,
        });
    });
    const getTransactionStatistics = (0, express_async_handler_1.default)(async (req, res) => {
        const { transactions, lastTransactions } = await (0, get_3.handleGetTransactionStastics)(dbTransaction);
        res.status(httpStatusCodes_1.HttpStatusCodes.OK).json({
            success: true,
            nessage: `transaction statistics retirived`,
            transactions,
            lastTransactions,
        });
    });
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
exports.default = adminController;
