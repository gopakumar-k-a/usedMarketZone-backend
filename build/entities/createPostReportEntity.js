"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postReportEntity = void 0;
const postReportEntity = (reporterId, postId, reason, reasonType) => {
    return {
        getReporterId: () => reporterId,
        getPostId: () => postId,
        getReason: () => reason,
        getReasonType: () => reasonType,
    };
};
exports.postReportEntity = postReportEntity;
