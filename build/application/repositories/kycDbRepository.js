"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.kycDbRepository = void 0;
const kycDbRepository = (repository) => {
    const createNewKycRequest = async (createKycEntity) => await repository.createNewKycRequest(createKycEntity);
    const getKycByUserId = async (userId) => await repository.getKycByUserId(userId);
    const getKycAdmin = async (page = 1, limit = 5, searchQuery = "", sort = "createdAt_desc") => await repository.getKycAdmin(page, limit, searchQuery, sort);
    const handleKycRequestAdmin = async (kycId, type) => await repository.handleKycRequestAdmin(kycId, type);
    const checkKycIsVerified = (userId) => repository.checkKycIsVerified(userId);
    return {
        createNewKycRequest,
        getKycByUserId,
        getKycAdmin,
        handleKycRequestAdmin,
        checkKycIsVerified,
    };
};
exports.kycDbRepository = kycDbRepository;
