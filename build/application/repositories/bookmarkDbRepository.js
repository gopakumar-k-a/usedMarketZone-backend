"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookmarkDbRepository = void 0;
const bookmarkDbRepository = (repository) => {
    const findUserBookmarks = async (userId) => await repository.findUserBookmarks(userId);
    const addPostToUserBookmarks = async (userId, postId) => await repository.addPostToUserBookmarks(userId, postId);
    const removePostFromUserBookmarks = async (userId, postId) => await repository.removePostFromUserBookmarks(userId, postId);
    const getOwnerBookmarkImageList = async (ownerId) => repository.getOwnerBookmarkImageList(ownerId);
    return {
        findUserBookmarks,
        addPostToUserBookmarks,
        removePostFromUserBookmarks,
        getOwnerBookmarkImageList
    };
};
exports.bookmarkDbRepository = bookmarkDbRepository;
