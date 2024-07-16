import { createKycEntity } from "../../../entities/createKycEntity";
import { KycRepository } from "../../repositories/kycDbRepository";

export const handleCreateNewKycRequest = async(
  userId: string,
  kycData: {
    name: string;
    dob: string;
    idType: string;
    idNumber: string;
    phone: string;
  },
  KycRepository: KycRepository
) => {
  const newKycEntity = createKycEntity(
    kycData.name,
    userId,
    kycData.dob,
    kycData.idType,
    kycData.idNumber,
    kycData.phone
  );

  await KycRepository.createNewKycRequest(newKycEntity);
  return;
};
