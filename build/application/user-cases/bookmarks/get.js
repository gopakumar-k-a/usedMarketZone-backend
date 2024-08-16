"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleGetBookmarkImageList = void 0;
const handleGetBookmarkImageList = async (ownerId, bookmarkRepository) => {
    const imageList = await bookmarkRepository.getOwnerBookmarkImageList(ownerId);
    return imageList;
};
exports.handleGetBookmarkImageList = handleGetBookmarkImageList;
