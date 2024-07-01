
export const postReportEntity = (
  reporterId: string,
  postId: string,
  reason: string,
  reasonType: string
) => {
  return {
    getReporterId: (): string => reporterId,
    getPostId: (): string => postId,
    getReason: (): string => reason,
    getReasonType: (): string => reasonType,
  };
};

export type PostReportEntityType=ReturnType<typeof postReportEntity>
