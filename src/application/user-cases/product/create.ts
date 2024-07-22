import { commentEntity } from "../../../entities/createCommentEntity";
import { PostReportEntityType } from "../../../entities/createPostReportEntity";
import { postReportEntity } from "../../../entities/createPostReportEntity";
import { HttpStatusCodes } from "../../../types/httpStatusCodes";
import AppError from "../../../utils/appError";
import { CommentDbRepository } from "../../repositories/commentRepository";
import { PostReportDbInterface } from "../../repositories/postReportRepository";
import { io } from "../../../app";
import { getRecieverSocketId } from "../../../frameworks/webSocket/socket";
export const handlePostReportSubmit = async (
  reporterId: string,
  postData: {
    postId: string;
    reason: string;
    reasonType: string;
  },
  postReportRepository: ReturnType<PostReportDbInterface>
) => {
  const createPostReportEntity = postReportEntity(
    reporterId,
    postData.postId,
    postData.reason,
    postData.reasonType
  );

  const newPostReport = await postReportRepository.submitPostReport(
    createPostReportEntity
  );

  console.log("createPostReport Entity ", createPostReportEntity);
  if (!newPostReport) {
    throw new AppError(
      "Cant Submit Post Report Try Again Later ",
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }

  if (newPostReport == "exists") {
    console.log("newPostReport==exists");

    throw new AppError(
      "Already Submitted Report ,Can't Submit Report On Product ",
      HttpStatusCodes.CONFLICT
    );
  }
  return true;
};

export const handleAddComment = async (
  commentData: {
    content: string;
    postId: string;
  },
  authorId: string,
  commentRepository: CommentDbRepository
) => {
  // content:string,
  // authorId:string,
  // postId:string,
  // parentCommentId:string|null=null
  const createCommentEntity = commentEntity(
    commentData.content,
    authorId,
    commentData.postId
  );

  const newComment = await commentRepository.addNewComment(createCommentEntity);
  const recieverSocketId = getRecieverSocketId(
    String(newComment[0].productOwnerId)
  );
  console.log("recieverSocketId ", recieverSocketId);
  if (recieverSocketId) {
    io.to(recieverSocketId).emit("notification", {
      title: "New Comment",
      description: "You have received a Comment On The Product",
    });
  }

  return newComment;
};
