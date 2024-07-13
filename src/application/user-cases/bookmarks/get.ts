import { BookmarkDbRepository } from "../../repositories/bookmarkDbRepository";

export const handleGetBookmarkImageList = async (
  ownerId: string,
  bookmarkRepository: BookmarkDbRepository
) => {
  const imageList = await bookmarkRepository.getOwnerBookmarkImageList(ownerId);

  return imageList;
};
