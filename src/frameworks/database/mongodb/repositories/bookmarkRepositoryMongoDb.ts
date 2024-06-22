import Bookmark from "../models/bookmarkModel";

export const bookmarkRepositoryMongoDb = () => {
  const findUserBookmarks = async (userId: string) => {
    const bookmarkDoc = await Bookmark.findOne({ userId });

    if (!bookmarkDoc) return { userId, postIds: [] };

    return bookmarkDoc;
  };

  const addPostToUserBookmarks = async (userId: string, postId: string) => {
    const bookmark = await Bookmark.findOne({ userId });

    if (bookmark) {
      await Bookmark.updateOne({ userId }, { $push: { postIds: postId } });
    } else {
      const newBookmark = new Bookmark({ userId, postIds: [postId] });
      await newBookmark.save();
    }

    return true;
  };

  const removePostFromUserBookmarks = async (userId: string, postId: string) => {
    const bookmark = await Bookmark.findOne({ userId });

    if (bookmark) {
      await Bookmark.updateOne({ userId }, { $pull: { postIds: postId } });
    }

    return true;
  };

  return {
    findUserBookmarks,
    addPostToUserBookmarks,
    removePostFromUserBookmarks,
  };
};

export type BookmarkRepositoryMongoDb=typeof bookmarkRepositoryMongoDb