"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAddComment = exports.handlePostReportSubmit = void 0;
const createCommentEntity_1 = require("../../../entities/createCommentEntity");
const createPostReportEntity_1 = require("../../../entities/createPostReportEntity");
const httpStatusCodes_1 = require("../../../types/httpStatusCodes");
const appError_1 = __importDefault(require("../../../utils/appError"));
const app_1 = require("../../../app");
const socket_1 = require("../../../frameworks/webSocket/socket");
const handlePostReportSubmit = async (reporterId, postData, postReportRepository) => {
    const createPostReportEntity = (0, createPostReportEntity_1.postReportEntity)(reporterId, postData.postId, postData.reason, postData.reasonType);
    const newPostReport = await postReportRepository.submitPostReport(createPostReportEntity);
    if (!newPostReport) {
        throw new appError_1.default("Cant Submit Post Report Try Again Later ", httpStatusCodes_1.HttpStatusCodes.INTERNAL_SERVER_ERROR);
    }
    if (newPostReport == "exists") {
        throw new appError_1.default("Already Submitted Report ,Can't Submit Report On Product ", httpStatusCodes_1.HttpStatusCodes.CONFLICT);
    }
    return true;
};
exports.handlePostReportSubmit = handlePostReportSubmit;
const handleAddComment = async (commentData, authorId, commentRepository) => {
    const createCommentEntity = (0, createCommentEntity_1.commentEntity)(commentData.content, authorId, commentData.postId);
    const newComment = await commentRepository.addNewComment(createCommentEntity);
    const recieverSocketId = (0, socket_1.getRecieverSocketId)(String(newComment[0].productOwnerId));
    if (recieverSocketId) {
        app_1.io.to(recieverSocketId).emit("notification", {
            title: "New Comment",
            description: "You have received a Comment On The Product",
        });
    }
    return newComment;
};
exports.handleAddComment = handleAddComment;
