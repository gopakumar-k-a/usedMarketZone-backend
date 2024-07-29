import { ProductRepositoryMongoDb } from "../../frameworks/database/mongodb/repositories/productRepositoryMongoDb";
import { PostEntityType } from "../../entities/createProductPostEntity";
import { BidPostEntityType } from "../../entities/createBidPostEntity";
import { BidDuration } from "../../types/product";
import { IProduct } from "../../frameworks/database/mongodb/models/productModel";
import { Types } from "mongoose";

export const productDbRepository = (
  repository: ReturnType<ProductRepositoryMongoDb>
) => {
  const postProduct = async (product: PostEntityType) =>
    await repository.postProduct(product);
  const postBid = async (bid: BidPostEntityType) => repository.postBid(bid);
  const getAllProductPost = async (userId: string) =>
    await repository.getAllProductPost(userId);
  const updateProductBookmarkCount = async (
    productId: string,
    action: string
  ) => await repository.updateProductBookmarkCount(productId, action);
  const addUserToProductBookmark = async (userId: string, productId: string) =>
    repository.addUserToProductBookmark(userId, productId);
  const removeUserFromProductBookmark = async (
    userId: string,
    productId: string
  ) => repository.removeUserFromProductBookmark(userId, productId);

  const getUserPosts = async (userId: string) =>
    await repository.getUserPosts(userId);
  const getUserPostDetailsAdmin = async (postId: string) =>
    await repository.getUserPostDetailsAdmin(postId);
  const updateAdminAcceptBidStatus = async (
    bidProductId: string,
    bidDuration: BidDuration
  ) => await repository.updateAdminAcceptBidStatus(bidProductId, bidDuration);
  const getAllUserPosts = async () => repository.getAllUserPosts();
  const getOwnerPostsImageList = async (ownerId: string) =>
    await repository.getOwnerPostsImageList(ownerId);
  const getUserPostDetails = async (userId: string, postId: string) =>
    await repository.getUserPostDetails(userId, postId);
  const updateProduct = async (productId: string, update: IProduct) =>
    await repository.updateProduct(productId, update);
  const blockProductByAdmin = async (productId: string) =>
    repository.blockProductByAdmin(productId);
  const deactivateProductSellPost = async (userId: string, productId: string) =>
    await repository.deactivateProductSellPost(userId, productId);
  const searchProduct = async (query: string, isBidding: boolean,userId:Types.ObjectId) =>await repository.searchProduct(query,isBidding,userId)
  const getUserBids = async (userId: Types.ObjectId) =>await repository.getUserBids(userId)
  const getAllProductPostAdmin = async () =>await repository.getAllProductPostAdmin()
  const getNumberOfProducts=async()=>await repository.getNumberOfProducts()
  return {
    postProduct,
    getAllProductPost,
    updateProductBookmarkCount,
    addUserToProductBookmark,
    removeUserFromProductBookmark,
    getUserPosts,
    getUserPostDetailsAdmin,
    postBid,
    updateAdminAcceptBidStatus,
    getAllUserPosts,
    getOwnerPostsImageList,
    getUserPostDetails,
    updateProduct,
    blockProductByAdmin,
    deactivateProductSellPost,
    searchProduct,
    getUserBids,
    getAllProductPostAdmin,
    getNumberOfProducts
  };
};

export type ProductDbInterface = typeof productDbRepository;
