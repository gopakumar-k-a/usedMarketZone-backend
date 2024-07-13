import { CreateKycEntityType } from "../../entities/createKycEntity";
import { KycRepositoryMongoDB } from "../../frameworks/database/mongodb/repositories/kycRepositoryMongoDB";

export const kycDbRepositoty = (
  repository: ReturnType<KycRepositoryMongoDB>
) => {
  const createNewKycRequest = async (createKycEntity: CreateKycEntityType) =>
    repository.createNewKycRequest(createKycEntity);

  return { createNewKycRequest };
};
