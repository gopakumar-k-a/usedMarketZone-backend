import KYC from "../models/kycModel";
import { CreateKycEntityType } from "../../../../entities/createKycEntity";
import AppError from "../../../../utils/appError";
import { HttpStatusCodes } from "../../../../types/httpStatusCodes";
export const kycRepositoryMongoDB = () => {
  const createNewKycRequest = async (createKycEntity: CreateKycEntityType) => {
    const existingKycRequest = await KYC.findOne({
      userId: createKycEntity.getUserId(),
    });

    if (existingKycRequest) {
      throw new AppError(
        "CantSubmit, KYC Request Already Exists",
        HttpStatusCodes.NOT_ACCEPTABLE
      );
    }

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
