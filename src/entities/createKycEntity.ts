import { Types } from "mongoose";
export const createKycEntity = (
  name: string,
  userId: string,
  dob: string,
  idType: string,
  idNumber:string,
  phone: string
) => {
  return {
    getName: (): string => name,
    getUserId: (): Types.ObjectId => new Types.ObjectId(userId),
    getDob: (): Date => new Date(dob),
    getIdType: (): string => idType,
    getIdNumber:():string=>idNumber,
    getPhone: (): string => phone,
  };
};

export type CreateKycEntityType = ReturnType<typeof createKycEntity>;
