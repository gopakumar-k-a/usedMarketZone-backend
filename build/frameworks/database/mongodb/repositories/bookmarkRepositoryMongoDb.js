"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookmarkRepositoryMongoDb = void 0;
const httpStatusCodes_1 = require("../../../../types/httpStatusCodes");
const appError_1 = __importDefault(require("../../../../utils/appError"));
const bookmarkModel_1 = __importDefault(require("../models/bookmarkModel"));
const bookmarkRepositoryMongoDb = () => {
    const findUserBookmarks = async (ownerId) => {
        const bookmarkDoc = await bookmarkModel_1.default.findOne({ userId: ownerId });
        if (!bookmarkDoc)
            return { ownerId, postIds: [] };
        return bookmarkDoc;
    };
    const getOwnerBookmarkImageList = async (ownerId) => {
        const bookmarkListImages = await bookmarkModel_1.default.aggregate([
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
                    isBidding: "$postData.isBidding"
                },
            },
        ]);
        if (!bookmarkListImages) {
            throw new appError_1.default("Invalid Post Id", httpStatusCodes_1.HttpStatusCodes.BAD_GATEWAY);
        }
        return bookmarkListImages;
    };
    const addPostToUserBookmarks = async (userId, postId) => {
        const bookmark = await bookmarkModel_1.default.findOne({ userId });
        if (bookmark) {
            await bookmarkModel_1.default.updateOne({ userId }, { $push: { postIds: postId } });
        }
        else {
            const newBookmark = new bookmarkModel_1.default({ userId, postIds: [postId] });
            await newBookmark.save();
        }
        return true;
    };
    const removePostFromUserBookmarks = async (userId, postId) => {
        const bookmark = await bookmarkModel_1.default.findOne({ userId });
        if (bookmark) {
            await bookmarkModel_1.default.updateOne({ userId }, { $pull: { postIds: postId } });
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
exports.bookmarkRepositoryMongoDb = bookmarkRepositoryMongoDb;
