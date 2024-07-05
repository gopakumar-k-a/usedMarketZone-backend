import { CommentDbInterface } from "../../repositories/commentRepository";
export const handleDeleteComment = async (
  deletCommentIds: {
    commentId: string;
    parentCommentId: string | null;
  },
  DbCommentRepository: ReturnType<CommentDbInterface>
) => {
  await DbCommentRepository.deleteComment(
    deletCommentIds.commentId,
    deletCommentIds.parentCommentId
  );
  return;
};
