"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.kycRepositoryMongoDB = void 0;
const kycModel_1 = __importDefault(require("../models/kycModel"));
const appError_1 = __importDefault(require("../../../../utils/appError"));
const httpStatusCodes_1 = require("../../../../types/httpStatusCodes");
const kycRepositoryMongoDB = () => {
    const createNewKycRequest = async (createKycEntity) => {
        const existingKycRequest = await kycModel_1.default.findOne({
            userId: createKycEntity.getUserId(),
        });
        if (existingKycRequest) {
            throw new appError_1.default("CantSubmit, KYC Request Already Exists", httpStatusCodes_1.HttpStatusCodes.NOT_ACCEPTABLE);
        }
        const newKycRequest = new kycModel_1.default({
            name: createKycEntity.getName(),
            userId: createKycEntity.getUserId(),
            dob: createKycEntity.getDob(),
            idType: createKycEntity.getIdType(),
            idNumber: createKycEntity.getIdNumber(),
            phone: createKycEntity.getPhone(),
        });
        await newKycRequest.save();
        return newKycRequest;
    };
    const getKycByUserId = async (userId) => {
        const kycData = await kycModel_1.default.findOne({ userId });
        return kycData;
    };
    const getKycAdmin = async (page = 1, limit = 5, searchQuery = "", sort = "createdAt_desc") => {
        const skip = (page - 1) * limit;
        const sortCriteria = {};
        switch (sort) {
            case "createdAt_asc":
                sortCriteria.createdAt = 1;
                break;
            case "createdAt_desc":
                sortCriteria.createdAt = -1;
                break;
            default:
                sortCriteria.createdAt = -1;
        }
        const searchCriteria = searchQuery
            ? {
                $or: [
                    { name: { $regex: searchQuery, $options: "i" } },
                    { phone: { $regex: searchQuery, $options: "i" } },
                    { idNumber: { $regex: searchQuery, $options: "i" } },
                    { "userDetails.firstName": { $regex: searchQuery, $options: "i" } },
                    { "userDetails.lastName": { $regex: searchQuery, $options: "i" } },
                    { "userDetails.userName": { $regex: searchQuery, $options: "i" } },
                ],
            }
            : {};
        const kycData = await kycModel_1.default.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userDetails",
                },
            },
            {
                $unwind: "$userDetails",
            },
            {
                $match: searchCriteria,
            },
            {
                $project: {
                    name: 1,
                    dob: 1,
                    idType: 1,
                    idNumber: 1,
                    phone: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    status: 1,
                    isAdminAccepted: 1,
                    "userDetails.firstName": 1,
                    "userDetails.lastName": 1,
                    "userDetails.imageUrl": 1,
                    "userDetails.userName": 1,
                },
            },
            {
                $sort: sortCriteria,
            },
            {
                $skip: skip,
            },
            {
                $limit: limit,
            },
        ]);
        const totalDocuments = await kycModel_1.default.countDocuments(searchCriteria);
        return {
            kycData,
            totalDocuments,
            currentPage: page,
        };
    };
    const handleKycRequestAdmin = async (kycId, type) => {
        try {
            const updateData = type === "accept"
                ? { status: "accepted", isAdminAccepted: true }
                : { status: "rejected", isAdminAccepted: false };
            const updatedKyc = await kycModel_1.default.findByIdAndUpdate(kycId, { $set: updateData }, { new: true });
            if (!updatedKyc) {
                throw new appError_1.default("KYC request not found", httpStatusCodes_1.HttpStatusCodes.BAD_REQUEST);
            }
            return updatedKyc;
        }
        catch (error) {
            throw error;
        }
    };
    const checkKycIsVerified = (userId) => {
        const kycData = kycModel_1.default.findOne({ userId: userId, isAdminAccepted: true });
        return kycData;
    };
    return {
        createNewKycRequest,
        getKycByUserId,
        getKycAdmin,
        handleKycRequestAdmin,
        checkKycIsVerified,
    };
};
exports.kycRepositoryMongoDB = kycRepositoryMongoDB;
