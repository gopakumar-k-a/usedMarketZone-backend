"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentDbRepository = void 0;
const commentDbRepository = (repository) => {
    const addNewComment = async (commentEntity) => repository.addNewComment(commentEntity);
    const getAllComments = async (postId) => repository.getAllComments(postId);
    const getReplyData = async (parentCommentId) => repository.getReplyData(parentCommentId);
    const submitReplyComment = async (commentEntity) => repository.submitReplyComment(commentEntity);
    const deleteComment = async (commentId, parentCommentId = null) => await repository.deleteComment(commentId, parentCommentId);
    return {
        addNewComment,
        getReplyData,
        getAllComments,
        submitReplyComment,
        deleteComment
    };
};
exports.commentDbRepository = commentDbRepository;
