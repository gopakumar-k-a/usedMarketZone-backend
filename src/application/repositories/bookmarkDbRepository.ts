import { BookmarkRepositoryMongoDb } from "../../frameworks/database/mongodb/repositories/bookmarkRepositoryMongoDb";

export const bookmarkDbRepository = (
  repository: ReturnType< BookmarkRepositoryMongoDb>
) => {
  const findUserBookmarks = async (userId: string) =>
    await repository.findUserBookmarks(userId);
  const addPostToUserBookmarks = async (userId: string, postId: string) =>
    await repository.addPostToUserBookmarks(userId, postId);
  const removePostFromUserBookmarks = async (userId: string, postId: string) =>
    await repository.removePostFromUserBookmarks(userId, postId);

  return {
    findUserBookmarks,
    addPostToUserBookmarks,
    removePostFromUserBookmarks,
  };
};

export type BookmarkDbRepository = ReturnType<typeof bookmarkDbRepository>;

export type BookMarkDbInterface=typeof bookmarkDbRepository
