import KYC from "../models/kycModel";
import { CreateKycEntityType } from "../../../../entities/createKycEntity";
export const kycRepositoryMongoDB = () => {
  const createNewKycRequest = async (createKycEntity: CreateKycEntityType) => {
    const newKycRequest = new KYC({
      name: createKycEntity.getName(),
      userId: createKycEntity.getUserId(),
      dob: createKycEntity.getDob(),
      idType: createKycEntity.getIdType(),
      idNumber: createKycEntity.getIdNumber(),
      phone: createKycEntity.getPhone(),
    });

    await newKycRequest.save();
    return newKycRequest;
  };

  return {
    createNewKycRequest,
  };
};

export type KycRepositoryMongoDB = typeof kycRepositoryMongoDB;
