

import { UserRepositoryMongoDb } from "../../frameworks/database/mongodb/repositories/userRepositoryMongoDb"

import { UserEntityType } from "../../entities/user"

import { OtpEntityType } from "../../entities/otp"
import { UserInterface } from "../../types/userInterface"




export const userDbRepository = (repository: ReturnType<UserRepositoryMongoDb>) => {

    const getUserByEmail = async (email: string)  => await repository.getUserByEmail(email)
    const addUser = async (user: UserEntityType) => await repository.addUser(user)
    const addOtp = async (otpData: OtpEntityType)=>await repository.addOtp(otpData)
    const otpByEmail=async (email:string)=>await repository.otpByEmail(email)
    const getUserByUserName=async(userName:string)=>await repository.getUserByUserName(userName)
    const getUserById=async(userId:string)=>await repository.getUserById(userId)
    const updateUserProfile=async(userData:UserInterface,userId:string)=>await repository.updateUserProfile(userData,userId)
    const updateUserImage=async(imageUrl:string,userId:string)=>await repository.updateUserImage(imageUrl,userId)

    return {
        addUser,
        getUserByEmail,
        addOtp,
        otpByEmail,
        getUserByUserName,
        getUserById,
        updateUserProfile,
        updateUserImage
    }
}

export type UserDbInterface = typeof userDbRepository

