import { ProductPostForm } from "../../../types/product";
import postEntity from "../../../entities/createProductPostEntity";
import { ProductDbInterface } from "../../repositories/productDbRepository";
import { BookMarkDbInterface } from "../../repositories/bookmarkDbRepository";
// import {BookMarkDbInterface}  from "../../repositories/bookmarkDbRepository";

export const handlePostProduct = async (
  postData: ProductPostForm,
  userId: string,
  productRepository: ReturnType<ProductDbInterface>
) => {
  const {
    productName,
    basePrice,
    productImageUrls,
    category,
    subCategory,
    phone,
    description,
    productCondition,
    address,
    productAge,
  } = postData;

  const createPostEntity = postEntity(
    productName,
    basePrice,
    userId,
    productImageUrls,
    category,
    subCategory,
    phone,
    description,
    productCondition,
    address,
    productAge
  );

  console.log("createPostEntity ", createPostEntity);

  await productRepository.postProduct(createPostEntity);
  return;
};

export const handleAddOrRemoveBookmark = async (
  userId: string,
  postId: string,
  bookmarkRepository: ReturnType<BookMarkDbInterface>,
  productRepository:ReturnType<ProductDbInterface>
) => {

  const bookmark = await bookmarkRepository.findUserBookmarks(userId);
  console.log("bookmark is ", bookmark);


  if (!bookmark) {

    await bookmarkRepository.addPostToUserBookmarks(userId, postId);
    return { action: "added" };
  }

  if (Array.isArray(bookmark.postIds)) {
    const isBookmarked = bookmark.postIds.includes(postId);

    if (isBookmarked) {

      await bookmarkRepository.removePostFromUserBookmarks(userId, postId);
      return { action: "removed" };
    } else {
   
      await bookmarkRepository.addPostToUserBookmarks(userId, postId);
      return { action: "added" };
    }
  } else {

    console.error("Unexpected format for bookmark.postIds:", bookmark.postIds);
    return { action: "error" };
  }


};
