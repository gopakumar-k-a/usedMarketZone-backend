import { CreateKycEntityType } from "../../entities/createKycEntity";
import { KycRepositoryMongoDB } from "../../frameworks/database/mongodb/repositories/kycRepositoryMongoDB";

export const kycDbRepository = (
  repository: ReturnType<KycRepositoryMongoDB>
) => {
  const createNewKycRequest = async (createKycEntity: CreateKycEntityType) =>
    repository.createNewKycRequest(createKycEntity);

  return { createNewKycRequest };
};

export type KycInterface=typeof kycDbRepository
export type  KycRepository=ReturnType<typeof kycDbRepository>
