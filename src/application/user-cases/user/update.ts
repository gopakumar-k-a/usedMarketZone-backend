import { HttpStatusCodes } from "../../../types/httpStatusCodes";
import AppError from "../../../utils/appError";
import { UserDbInterface } from "../../repositories/userDbRepository";
import { UserInterface } from "../../../types/userInterface";
import { removeSensitiveFields } from "./read";

export const updateUserProfile = async (
  userData: UserInterface,
  userId: string,
  userRepository: ReturnType<UserDbInterface>
) => {
  if (!userData) {
    throw new AppError(
      "try again something went wrong",
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  const updatedUserObj = await userRepository.updateUserProfile(
    userData,
    userId
  );
  const formatedUserData = await removeSensitiveFields(updatedUserObj);

  console.log(
    "user datat in inside formatedUserData use case ",
    formatedUserData
  );
  return formatedUserData;
};


export const updateUserImage=async(imageUrl:string,userId:string,userRepository: ReturnType<UserDbInterface>)=>{


const updatedUserObj=await userRepository.updateUserImage(imageUrl,userId)
const formatedUserData = await removeSensitiveFields(updatedUserObj);

return formatedUserData;




}

export const  modifyUserAccess=async(userId:string,userRepository:ReturnType<UserDbInterface>)=>{

  const updatedUser=await userRepository.modifyUserAccess(userId)
  
  if(!updatedUser){
    throw new AppError("user not found ",HttpStatusCodes.NOT_FOUND)
  }

  return updatedUser

}
