

import { UserRepositoryMongoDb } from "../../frameworks/database/mongodb/repositories/userRepositoryMongoDb"

import { UserEntityType } from "../../entities/user"

import { OtpEntityType } from "../../entities/otp"




export const userDbRepository = (repository: ReturnType<UserRepositoryMongoDb>) => {

    const getUserByEmail = async (email: string) => await repository.getUserByEmail(email)
    const addUser = async (user: UserEntityType) => await repository.addUser(user)
    const addOtp = async (otpData: OtpEntityType)=>await repository.addOtp(otpData)

    return {
        addUser,
        getUserByEmail,
        addOtp
    }
}

export type UserDbInterface = typeof userDbRepository

