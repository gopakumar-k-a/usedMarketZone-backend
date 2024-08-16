"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentEntity = void 0;
const commentEntity = (content, authorId, postId, parentCommentId = null) => {
    return {
        getContent: () => content,
        getAuthorId: () => authorId,
        getPostId: () => postId,
        getParentCommentId: () => parentCommentId,
    };
};
exports.commentEntity = commentEntity;
