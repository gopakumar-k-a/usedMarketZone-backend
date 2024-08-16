"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCreateNewKycRequest = void 0;
const createKycEntity_1 = require("../../../entities/createKycEntity");
const handleCreateNewKycRequest = async (userId, kycData, KycRepository) => {
    const newKycEntity = (0, createKycEntity_1.createKycEntity)(kycData.name, userId, kycData.dob, kycData.idType, kycData.idNumber, kycData.phone);
    await KycRepository.createNewKycRequest(newKycEntity);
    return;
};
exports.handleCreateNewKycRequest = handleCreateNewKycRequest;
