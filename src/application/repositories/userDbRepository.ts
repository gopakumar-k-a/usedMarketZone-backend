

import { UserRepositoryMongoDb } from "../../frameworks/database/mongodb/repositories/userRepositoryMongoDb"

import { UserEntityType } from "../../entities/user"

import { OtpEntityType } from "../../entities/otp"




export const userDbRepository = (repository: ReturnType<UserRepositoryMongoDb>) => {

    const getUserByEmail = async (email: string)  => await repository.getUserByEmail(email)
    const addUser = async (user: UserEntityType) => await repository.addUser(user)
    const addOtp = async (otpData: OtpEntityType)=>await repository.addOtp(otpData)
    const otpByEmail=async (email:string)=>await repository.otpByEmail(email)
    const getUserByUserName=async(userName:string)=>await repository.getUserByUserName(userName)

    return {
        addUser,
        getUserByEmail,
        addOtp,
        otpByEmail,
        getUserByUserName
    }
}

export type UserDbInterface = typeof userDbRepository

