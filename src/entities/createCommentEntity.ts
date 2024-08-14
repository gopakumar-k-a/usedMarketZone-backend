export const commentEntity = (
  content: string,
  authorId: string,
  postId: string,
  parentCommentId: string | null = null
) => {
  return {
    getContent: () => content,
    getAuthorId: () => authorId,
    getPostId: () => postId,
    getParentCommentId: () => parentCommentId,
  };
};
export type CommentEntityType = ReturnType<typeof commentEntity>;
