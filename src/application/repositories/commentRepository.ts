import { CommentEntityType } from "../../entities/createCommentEntity";
import { CommentRepositoryMongoDb } from "../../frameworks/database/mongodb/repositories/commentRepositoryMongoDb";

export const commentDbRepository = (
  repository: ReturnType<CommentRepositoryMongoDb>
) => {
  const addNewComment = async (commentEntity: CommentEntityType) =>
    repository.addNewComment(commentEntity);
  const getAllComments = async (postId: string) =>
    repository.getAllComments(postId);
  const getReplyData = async (parentCommentId: string) =>
    repository.getReplyData(parentCommentId);
  const submitReplyComment = async (commentEntity: CommentEntityType) =>
    repository.submitReplyComment(commentEntity);
  const deleteComment = async (
    commentId: string,
    parentCommentId: string | null = null
  ) => await repository.deleteComment(commentId, parentCommentId);

  return {
    addNewComment,
    getReplyData,
    getAllComments,
    submitReplyComment,
    deleteComment
  };
};

export type CommentDbRepository = ReturnType<typeof commentDbRepository>;

export type CommentDbInterface = typeof commentDbRepository;
