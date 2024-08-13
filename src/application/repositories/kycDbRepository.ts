import { Types } from "mongoose";
import { CreateKycEntityType } from "../../entities/createKycEntity";
import { KycRepositoryMongoDB } from "../../frameworks/database/mongodb/repositories/kycRepositoryMongoDB";

export const kycDbRepository = (
  repository: ReturnType<KycRepositoryMongoDB>
) => {
  const createNewKycRequest = async (createKycEntity: CreateKycEntityType) =>
    await repository.createNewKycRequest(createKycEntity);
  const getKycByUserId = async (userId: Types.ObjectId) =>
    await repository.getKycByUserId(userId);
  const getKycAdmin = async (
    page: number = 1,
    limit: number = 5,
    searchQuery: string = "",
    sort: string = "createdAt_desc"
  ) => await repository.getKycAdmin(page, limit, searchQuery, sort);
  const handleKycRequestAdmin = async (
    kycId: Types.ObjectId,
    type: "accept" | "reject"
  ) => await repository.handleKycRequestAdmin(kycId, type);
  const checkKycIsVerified = (userId: Types.ObjectId) =>
    repository.checkKycIsVerified(userId);
  return {
    createNewKycRequest,
    getKycByUserId,
    getKycAdmin,
    handleKycRequestAdmin,
    checkKycIsVerified,
  };
};

export type KycInterface = typeof kycDbRepository;
export type KycRepository = ReturnType<typeof kycDbRepository>;
