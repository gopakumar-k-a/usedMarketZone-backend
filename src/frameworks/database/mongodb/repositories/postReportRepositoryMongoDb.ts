import PostReport from "../models/postReportModel";
import { PostReportEntityType } from "../../../../entities/createPostReportEntity";
export const postReportRepositoryMongoDb = () => {
  const submitPostReport = async (postReportEntity: PostReportEntityType) => {
    const existingReportByUserOnPost = await PostReport.findOne({
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
    const newPostReport = new PostReport(postReportData);
    await newPostReport.save();

    return newPostReport;
  };

  const getReports = async () => {
    const postReports = await PostReport.aggregate([
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
    const numberOfReports = await PostReport.aggregate([
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

export type PostReportRepositoryMongoDb = typeof postReportRepositoryMongoDb;
