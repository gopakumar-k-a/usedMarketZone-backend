"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productDbRepository = void 0;
const productDbRepository = (repository) => {
    const postProduct = async (product) => await repository.postProduct(product);
    const postBid = async (bid) => repository.postBid(bid);
    const getAllProductPost = async (userId) => await repository.getAllProductPost(userId);
    const updateProductBookmarkCount = async (productId, action) => await repository.updateProductBookmarkCount(productId, action);
    const addUserToProductBookmark = async (userId, productId) => repository.addUserToProductBookmark(userId, productId);
    const removeUserFromProductBookmark = async (userId, productId) => repository.removeUserFromProductBookmark(userId, productId);
    const getUserPosts = async (userId) => await repository.getUserPosts(userId);
    const getUserPostDetailsAdmin = async (postId) => await repository.getUserPostDetailsAdmin(postId);
    const updateAdminAcceptBidStatus = async (bidProductId, bidDuration) => await repository.updateAdminAcceptBidStatus(bidProductId, bidDuration);
    const getAllUserPosts = async () => repository.getAllUserPosts();
    const getOwnerPostsImageList = async (ownerId) => await repository.getOwnerPostsImageList(ownerId);
    const getUserPostDetails = async (userId, postId) => await repository.getUserPostDetails(userId, postId);
    const updateProduct = async (productId, update) => await repository.updateProduct(productId, update);
    const blockProductByAdmin = async (productId) => repository.blockProductByAdmin(productId);
    const deactivateProductSellPost = async (userId, productId) => await repository.deactivateProductSellPost(userId, productId);
    const searchProduct = async (query, isBidding, userId) => await repository.searchProduct(query, isBidding, userId);
    const getUserBids = async (userId) => await repository.getUserBids(userId);
    const getAllProductPostAdmin = async (page = 1, limit = 5, searchQuery = "", sort = "createdAt_desc") => await repository.getAllProductPostAdmin(page, limit, searchQuery, sort);
    const getNumberOfProducts = async () => await repository.getNumberOfProducts();
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
exports.productDbRepository = productDbRepository;
