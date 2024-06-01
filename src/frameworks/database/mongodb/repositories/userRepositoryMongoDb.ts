

import User from "../models/userModel"

import Otp from "../models/otpSchema"

import { UserEntityType } from "../../../../entities/user"

import { OtpEntityType } from "../../../../entities/otp"


export const userRepositoryMongoDb = () => {

    const getUserByEmail = async (email: string) => await User.findOne({ email: email })


    const addUser = async (user: UserEntityType) => {
        const newUser: any = new User({
            firstName: user.getFirstName(),
            lastName: user.getLastName(),
            email: user.getEmail(),
            phone: user.getPhone(),
            password: user.getPassword()
        })

        await newUser.save()

        return newUser
    }

    const addOtp = async (otpData: OtpEntityType) => {
        const newOtp:any= new Otp({
            email: otpData.getEmail(),
            otp:otpData.getOtp()
        })
        await newOtp.save()
    }

    return {
        addUser,
        getUserByEmail,
        addOtp
    }

}

export type UserRepositoryMongoDb = typeof userRepositoryMongoDb