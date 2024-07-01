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
    const newCommentData = await Comment.aggregate([
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
          replies: 1,
          createdAt: 1,
        },
      },
    ]);

    console.log("new comment data ", newCommentData);

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

    console.log("commentData ", commentData);

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

    console.log("replyData ", replyData);

    return replyData;
  };

  const submitReplyComment = async (commentEntity: CommentEntityType) => {
    const parentCommentId = commentEntity.getParentCommentId();
    console.log(
      "parent id parentCommentId submitReplyComment",
      parentCommentId
    );

    const newComment = new Comment({
      content: commentEntity.getContent(),
      authorId: commentEntity.getAuthorId(),
      postId: commentEntity.getPostId(),
      parentCommentId: commentEntity.getParentCommentId(),
    });

    await newComment.save();

    const updatedCommentData = await Comment.findByIdAndUpdate(
      parentCommentId,
      { $push: { replies: newComment._id } },
      { new: true }
    );
    console.log("updatedCommentData submitReplyComment", updatedCommentData);
    return updatedCommentData;
  };

  return {
    addNewComment,
    getAllComments,
    submitReplyComment,
    getReplyData
  };
};

export type CommentRepositoryMongoDb = typeof commentRepositoryMongoDb;
