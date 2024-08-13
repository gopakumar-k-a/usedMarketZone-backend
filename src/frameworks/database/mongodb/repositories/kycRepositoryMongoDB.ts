import KYC from "../models/kycModel";
import { CreateKycEntityType } from "../../../../entities/createKycEntity";
import AppError from "../../../../utils/appError";
import { HttpStatusCodes } from "../../../../types/httpStatusCodes";
import { Types } from "mongoose";
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

  const getKycByUserId = async (userId: Types.ObjectId) => {
    const kycData = await KYC.findOne({ userId });
    console.log(`user id ${userId}
  kycData ${kycData}`);

    return kycData;
  };

  const getKycAdmin = async (
    page: number = 1,
    limit: number = 5,
    searchQuery: string = "",
    sort: string = "createdAt_desc"
  ) => {
    const skip = (page - 1) * limit;

    type SortCriteria = {
      [key: string]: 1 | -1;
    };

    const sortCriteria: SortCriteria = {};

    switch (sort) {
      case "createdAt_asc":
        sortCriteria.createdAt = 1;
        break;
      case "createdAt_desc":
        sortCriteria.createdAt = -1;
        break;
      default:
        sortCriteria.createdAt = -1;
    }
    const searchCriteria = searchQuery
      ? {
          $or: [
            { name: { $regex: searchQuery, $options: "i" } },
            { phone: { $regex: searchQuery, $options: "i" } },
            { idNumber: { $regex: searchQuery, $options: "i" } },
            { "userDetails.firstName": { $regex: searchQuery, $options: "i" } },
            { "userDetails.lastName": { $regex: searchQuery, $options: "i" } },
            { "userDetails.userName": { $regex: searchQuery, $options: "i" } },
          ],
        }
      : {};
    const kycData = await KYC.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: "$userDetails",
      },
      {
        $match: searchCriteria,
      },
      {
        $project: {
          name: 1,
          dob: 1,
          idType: 1,
          idNumber: 1,
          phone: 1,
          createdAt: 1,
          updatedAt: 1,
          status: 1,
          isAdminAccepted: 1,
          "userDetails.firstName": 1,
          "userDetails.lastName": 1,
          "userDetails.imageUrl": 1,
          "userDetails.userName": 1,
        },
      },
      {
        $sort: sortCriteria,
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ]);
    const totalDocuments = await KYC.countDocuments(searchCriteria);

    console.log("kycData ", kycData);
    return {
      kycData,
      totalDocuments,
      currentPage: page,
    };
  };

  const handleKycRequestAdmin = async (
    kycId: Types.ObjectId,
    type: "accept" | "reject"
  ) => {
    try {
      const updateData =
        type === "accept"
          ? { status: "accepted", isAdminAccepted: true }
          : { status: "rejected", isAdminAccepted: false };

      const updatedKyc = await KYC.findByIdAndUpdate(
        kycId,
        { $set: updateData },
        { new: true }
      );

      if (!updatedKyc) {
        throw new AppError(
          "KYC request not found",
          HttpStatusCodes.BAD_REQUEST
        );
      }

      return updatedKyc;
    } catch (error) {
      console.error("Error updating KYC request:", error);
      throw error;
    }
  };

  const checkKycIsVerified = (userId: Types.ObjectId) => {
    const kycData = KYC.findOne({ userId: userId, isAdminAccepted: true });

    return kycData;
  };

  // const
  return {
    createNewKycRequest,
    getKycByUserId,
    getKycAdmin,
    handleKycRequestAdmin,
    checkKycIsVerified,
  };
};

export type KycRepositoryMongoDB = typeof kycRepositoryMongoDB;
