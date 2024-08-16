"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postReportRepositoryMongoDb = void 0;
const postReportModel_1 = __importDefault(require("../models/postReportModel"));
const postReportRepositoryMongoDb = () => {
    const submitPostReport = async (postReportEntity) => {
        const existingReportByUserOnPost = await postReportModel_1.default.findOne({
            reporterId: postReportEntity.getReporterId(),
            postId: postReportEntity.getPostId(),
        });
        if (existingReportByUserOnPost) {
            return "exists";
        }
        const postReportData = {
            reporterId: postReportEntity.getReporterId(),
            postId: postReportEntity.getPostId(),
            reason: postReportEntity.getReason(),
            reasonType: postReportEntity.getReasonType(),
        };
        const newPostReport = new postReportModel_1.default(postReportData);
        await newPostReport.save();
        return newPostReport;
    };
    const getReports = async () => {
        const postReports = await postReportModel_1.default.aggregate([
            {
                $lookup: {
                    from: "products",
                    localField: "postId",
                    foreignField: "_id",
                    as: "postData",
                },
            },
            { $unwind: "$postData" },
            {
                $lookup: {
                    from: "users",
                    localField: "reporterId",
                    foreignField: "_id",
                    as: "reporterData",
                },
            },
            { $unwind: "$reporterData" },
            {
                $lookup: {
                    from: "users",
                    localField: "postData.userId",
                    foreignField: "_id",
                    as: "postOwnerData",
                },
            },
            { $unwind: "$postOwnerData" },
            {
                $project: {
                    postIsBlocked: "$postData.isBlocked",
                    postIsBidding: "$postData.isBidding",
                    postOwnerId: "$postData.userId",
                    postOwnerName: "$postOwnerData.userName",
                    postId: "$postData._id",
                    postImageUrl: "$postData.productImageUrls",
                    reporterId: 1,
                    reporterName: "$reporterData.userName",
                    reason: 1,
                    reasonType: 1,
                    actionTaken: 1,
                },
            },
        ]);
        return postReports;
    };
    const getNumberOfPostReports = async () => {
        const numberOfReports = await postReportModel_1.default.aggregate([
            {
                $count: "numberOfReports",
            },
        ]);
        return numberOfReports[0];
    };
    return {
        submitPostReport,
        getReports,
        getNumberOfPostReports,
    };
};
exports.postReportRepositoryMongoDb = postReportRepositoryMongoDb;
