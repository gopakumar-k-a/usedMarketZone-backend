"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bidController = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const httpStatusCodes_1 = require("../../types/httpStatusCodes");
const update_1 = require("../../application/user-cases/product/update");
const update_2 = require("../../application/user-cases/bid/update");
const get_1 = require("../../application/user-cases/bid/get");
const bidController = (productDbRepository, productDbImpl, adminBidRequestDbRepository, adminBidRequestDbImpl, bidRepositoryDb, bidRepositoryDbImpl, bidHistroryDbRepository, bidHistoryDbImpl, kycRepositoryDb, kycRepositoryImpl) => {
    const dbRepositoryProduct = productDbRepository(productDbImpl());
    const dbRepositoryAdminBidRequest = adminBidRequestDbRepository(adminBidRequestDbImpl());
    const dbBidRepository = bidRepositoryDb(bidRepositoryDbImpl());
    const dbBidHistoryRepository = bidHistroryDbRepository(bidHistoryDbImpl());
    const dbKycRepository = kycRepositoryDb(kycRepositoryImpl());
    const productBidPost = (0, express_async_handler_1.default)(async (req, res) => {
        const { _id } = req.user;
        await (0, update_1.handleProductBidPost)(req.body, _id, dbRepositoryProduct, dbRepositoryAdminBidRequest);
        res.status(httpStatusCodes_1.HttpStatusCodes.OK).json({
            success: true,
            message: "product posted success",
        });
    });
    const placeBid = (0, express_async_handler_1.default)(async (req, res) => {
        const { _id } = req.user;
        const { bidAmount } = req.body;
        const { bidProductId } = req.params;
        const totalBidAmount = await (0, update_2.handlePlaceBid)(_id, bidProductId, bidAmount, dbBidRepository, dbBidHistoryRepository, dbKycRepository);
        res.status(httpStatusCodes_1.HttpStatusCodes.OK).json({
            success: true,
            message: "bid placed successfully",
            totalBidAmount,
        });
    });
    const getBidDetailsOfUserOnProduct = (0, express_async_handler_1.default)(async (req, res) => {
        const { _id } = req.user;
        const { bidProductId } = req.params;
        const bidHistory = await (0, get_1.handleGetBidDetailsOfUserOnProduct)(_id, bidProductId, dbBidHistoryRepository);
        res.status(httpStatusCodes_1.HttpStatusCodes.OK).json({
            success: true,
            message: "bid History Retrived successfully",
            bidHistory,
        });
    });
    const getUserBids = (0, express_async_handler_1.default)(async (req, res) => {
        const { _id: userId } = req.user;
        const userBids = await (0, get_1.handleGetUserWiseBidRequests)(userId, dbRepositoryAdminBidRequest, dbRepositoryProduct);
        res.status(httpStatusCodes_1.HttpStatusCodes.OK).json({
            success: true,
            message: "bid Requests Retrived Successfully",
            userBids,
        });
    });
    const getMyParticipatingBids = (0, express_async_handler_1.default)(async (req, res) => {
        const { _id: userId } = req.user;
        const userParticipatingBids = await (0, get_1.handleGetMyParticipatingBids)(userId, dbBidHistoryRepository);
        res.status(httpStatusCodes_1.HttpStatusCodes.OK).json({
            success: true,
            message: "user participating bids retrived Successfully",
            userParticipatingBids,
        });
    });
    const getClaimBidDetails = (0, express_async_handler_1.default)(async (req, res) => {
        const { _id: userId } = req.user;
        const { productId } = req.params;
        const bidData = await (0, get_1.handleGetClaimProductDetails)(userId, productId, dbBidHistoryRepository);
        res.status(httpStatusCodes_1.HttpStatusCodes.OK).json({
            success: true,
            message: "claimable bid data retrived successfully",
            bidData,
        });
    });
    const addBidClaimerAddress = (0, express_async_handler_1.default)(async (req, res) => {
        const { bidId } = req.params;
        const newAddress = await (0, update_2.handleAddClaimerAddress)(bidId, req.body, dbBidRepository);
        res.status(httpStatusCodes_1.HttpStatusCodes.OK).json({
            success: true,
            message: "Claimer Address added successfully",
            newAddress,
        });
    });
    const getBidResultForOwner = (0, express_async_handler_1.default)(async (req, res) => {
        const { _id: userId } = req.user;
        const { productId } = req.params;
        const bidResult = await (0, get_1.handleGetBidResultForOwner)(productId, userId, dbBidRepository);
        res.status(httpStatusCodes_1.HttpStatusCodes.OK).json({
            success: true,
            message: "Bid Result retrived success",
            bidResult,
        });
    });
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
exports.bidController = bidController;
