"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userDbRepository = void 0;
const userDbRepository = (repository) => {
    const getUserByEmail = async (email) => await repository.getUserByEmail(email);
    const addUser = async (user) => await repository.addUser(user);
    const addOtp = async (otpData) => await repository.addOtp(otpData);
    const otpByEmail = async (email) => await repository.otpByEmail(email);
    const getUserByUserName = async (userName) => await repository.getUserByUserName(userName);
    const getUserById = async (userId) => await repository.getUserById(userId);
    const getUserWithOutPass = async (userId) => await repository.getUserWithOutPass(userId);
    const updateUserProfile = async (userData, userId) => await repository.updateUserProfile(userData, userId);
    const updateUserImage = async (imageUrl, userId) => await repository.updateUserImage(imageUrl, userId);
    const getAllUsers = async (startIndex, limit) => await repository.getAllUsers(startIndex, limit);
    const modifyUserAccess = async (userId) => await repository.modifyUserAccess(userId);
    const updateUserPassword = async (email, newPassword) => await repository.updateUserPassword(email, newPassword);
    const removeProfilePicUrl = async (userId) => await repository.removeProfilePicUrl(userId);
    const followUser = async (userId, userToFollowId) => await repository.followUser(userId, userToFollowId);
    const unFollowUser = async (userId, userToUnFollowId) => await repository.unFollowUser(userId, userToUnFollowId);
    const getSuggestedUsers = async (userId) => repository.getSuggestedUsers(userId);
    const getNumOfFollowById = async (userId) => repository.getNumOfFollowById(userId);
    const getFollowersById = async (userId) => repository.getFollowersById(userId);
    const getFollowingById = async (userId) => repository.getFollowingById(userId);
    const searchUser = async (query, userId) => await repository.searchUser(query, userId);
    const getNumberOfUsers = async () => await repository.getNumberOfUsers();
    return {
        addUser,
        getUserByEmail,
        addOtp,
        otpByEmail,
        getUserByUserName,
        getUserById,
        updateUserProfile,
        updateUserImage,
        getAllUsers,
        modifyUserAccess,
        updateUserPassword,
        removeProfilePicUrl,
        getUserWithOutPass,
        followUser,
        unFollowUser,
        getSuggestedUsers,
        getNumOfFollowById,
        getFollowersById,
        getFollowingById,
        searchUser,
        getNumberOfUsers
    };
};
exports.userDbRepository = userDbRepository;
