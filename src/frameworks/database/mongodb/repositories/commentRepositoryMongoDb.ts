import Comment from "../models/commentModel";
import { CommentEntityType } from "../../../../entities/createCommentEntity";
import mongoose from "mongoose";
const { ObjectId } = mongoose.Types;
export const commentRepositoryMongoDb = () => {
  const addNewComment = async (commentEntity: CommentEntityType) => {
    const newComment = new Comment({
      content: commentEntity.getContent(),
      authorId: commentEntity.getAuthorId(),
      postId: commentEntity.getPostId(),
    });

    await newComment.save();
    type CommentData = {
      imageUrl: string;
      userName: string;
      content: string;
      authorId: string;
      productOwnerId: string;
      replies: string[];
      createdAt: string;
    };
    const newCommentData: CommentData[] = await Comment.aggregate([
      {
        $match: {
          _id: newComment._id,
        },
      },
      {
        $lookup: {
          from: "users",
          foreignField: "_id",
          localField: "authorId",
          as: "userData",
        },
      },
      {
        $unwind: "$userData",
      },
      {
        $lookup: {
          from: "products",
          foreignField: "_id",
          localField: "postId",
          as: "productData",
        },
      },
      {
        $unwind: "$productData",
      },
      {
        $project: {
          imageUrl: "$userData.imageUrl",
          userName: "$userData.userName",
          content: 1,
          authorId: 1,
          productOwnerId: "$productData.userId",
          replies: 1,
          createdAt: 1,
        },
      },
    ]);

    return newCommentData;
  };

  const getAllComments = async (postId: string) => {
    const commentData = await Comment.aggregate([
      {
        $match: {
          postId: new ObjectId(postId),
          parentCommentId: null,
        },
      },
      {
        $lookup: {
          from: "users",
          foreignField: "_id",
          localField: "authorId",
          as: "userData",
        },
      },
      {
        $unwind: "$userData",
      },
      {
        $project: {
          imageUrl: "$userData.imageUrl",
          userName: "$userData.userName",
          content: 1,
          authorId: 1,
          createdAt: 1,
          replies: 1,
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
    ]);

    return commentData;
  };
  const getReplyData = async (parentCommentId: string) => {
    const replyData = await Comment.aggregate([
      {
        $match: {
          parentCommentId: new ObjectId(parentCommentId),
        },
      },
      {
        $lookup: {
          from: "users",
          foreignField: "_id",
          localField: "authorId",
          as: "userData",
        },
      },
      {
        $unwind: "$userData",
      },
      {
        $project: {
          imageUrl: "$userData.imageUrl",
          userName: "$userData.userName",
          content: 1,
          authorId: 1,
          createdAt: 1,
          // replies: 1,
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
    ]);

    return replyData;
  };

  const submitReplyComment = async (commentEntity: CommentEntityType) => {
    const parentCommentId = commentEntity.getParentCommentId();


    const newComment = new Comment({
      content: commentEntity.getContent(),
      authorId: commentEntity.getAuthorId(),
      postId: commentEntity.getPostId(),
      parentCommentId: commentEntity.getParentCommentId(),
    });

    await newComment.save();
    await Comment.findByIdAndUpdate(
      parentCommentId,
      { $push: { replies: newComment._id } },
      { new: true }
    );

    const newReply = await Comment.aggregate([
      {
        $match: {
          _id: newComment._id,
        },
      },
      {
        $lookup: {
          from: "users",
          foreignField: "_id",
          localField: "authorId",
          as: "userData",
        },
      },
      {
        $unwind: "$userData",
      },
      {
        $project: {
          imageUrl: "$userData.imageUrl",
          userName: "$userData.userName",
          content: 1,
          authorId: 1,
          createdAt: 1,
          parentCommentId: 1,
        },
      },
    ]);

    return newReply;
  };

  const deleteComment = async (
    commentId: string,
    parentCommentId: string | null = null
  ) => {
    if (parentCommentId) {
      await Comment.findByIdAndUpdate(parentCommentId, {
        $pull: { replies: commentId },
      });
    } else {
      const parentDocument = await Comment.findOne({ _id: commentId });
      if (parentDocument && parentDocument.replies.length > 0) {
        await Comment.deleteMany({ _id: { $in: parentDocument.replies } });
      }
    }
    await Comment.deleteOne({ _id: commentId });

    return;
  };

  return {
    addNewComment,
    getAllComments,
    submitReplyComment,
    getReplyData,
    deleteComment,
  };
};

export type CommentRepositoryMongoDb = typeof commentRepositoryMongoDb;
