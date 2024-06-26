import { ProductRepositoryMongoDb } from "../../frameworks/database/mongodb/repositories/productRepositoryMongoDb";
import { PostEntityType } from "../../entities/createProductPostEntity";
import { BidEntityType } from "../../entities/createBidPostEntity";
import { BidDuration } from "../../types/product";

export const productDbRepository = (
  repository: ReturnType<ProductRepositoryMongoDb>
) => {
  const postProduct = async (product: PostEntityType) =>
    await repository.postProduct(product);
  const postBid = async (bid: BidEntityType) => repository.postBid(bid)
  const getAllProductPost = async (userId:string) => await repository.getAllProductPost(userId);
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

  const getUserPosts=async(userId:string)=>await repository.getUserPosts(userId)
  const getUserPostDetailsAdmin=async(postId:string)=>await repository.getUserPostDetailsAdmin(postId)
  const updateAdminAcceptBidStatus = async (bidProductId: string,bidDuration:BidDuration) =>await repository.updateAdminAcceptBidStatus(bidProductId,bidDuration)
  const getAllUserPosts = async () => repository.getAllUserPosts()
  const getOwnerPostsImageList = async (ownerId: string) => await repository.getOwnerPostsImageList(ownerId)
  const getUserPostDetails=async(userId:string,postId:string)=>await repository.getUserPostDetails(userId,postId)

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
    getUserPostDetails
  };
};

export type ProductDbInterface = typeof productDbRepository;
