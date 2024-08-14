import { HttpStatusCodes } from "../../../../types/httpStatusCodes";
import AppError from "../../../../utils/appError";
import Bookmark from "../models/bookmarkModel";

export const bookmarkRepositoryMongoDb = () => {
  const findUserBookmarks = async (ownerId: string) => {
    const bookmarkDoc = await Bookmark.findOne({userId: ownerId });

    if (!bookmarkDoc) return { ownerId, postIds: [] };

    return bookmarkDoc;
  };

  const getOwnerBookmarkImageList = async (ownerId: string) => {
    const bookmarkListImages = await Bookmark.aggregate([
      {
        $match: {
          userId: ownerId,
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "postIds",
          foreignField: "_id",
          as: "postData",
        },
      },
      {
        $unwind: "$postData",
      },
      {
        $project: {
          postId: "$postData._id",
          bookmarkImageUrls: "$postData.productImageUrls",
          isBidding:"$postData.isBidding"
        },
      },
    ]);


    if (!bookmarkListImages) {
      throw new AppError("Invalid Post Id", HttpStatusCodes.BAD_GATEWAY);
    }

    return bookmarkListImages;
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

  const removePostFromUserBookmarks = async (
    userId: string,
    postId: string
  ) => {
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
    getOwnerBookmarkImageList,
  };
};

export type BookmarkRepositoryMongoDb = typeof bookmarkRepositoryMongoDb;
