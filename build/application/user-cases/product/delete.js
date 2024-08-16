"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleDeleteComment = void 0;
const handleDeleteComment = async (deletCommentIds, DbCommentRepository) => {
    await DbCommentRepository.deleteComment(deletCommentIds.commentId, deletCommentIds.parentCommentId);
    return;
};
exports.handleDeleteComment = handleDeleteComment;
