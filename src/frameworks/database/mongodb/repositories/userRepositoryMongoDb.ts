

import User from "../models/userModel"

import Otp from "../models/otpSchema"

import { UserEntityType } from "../../../../entities/user"

import { OtpEntityType } from "../../../../entities/otp"
import { CreateUserInterface } from "../../../../types/userInterface"


export const userRepositoryMongoDb = () => {

    const getUserByEmail=  async (email: string) => {
        const user: CreateUserInterface | null = await User.findOne({ email });
        return user;
    }


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
        const newOtp: any = new Otp({
            email: otpData.getEmail(),
            otp: otpData.getOtp()
        })
        await newOtp.save()
    }

    const otpByEmail = async (email: string) => await Otp.findOne({ email }).sort({ createdAt: -1 }).limit(1)

    return {
        addUser,
        getUserByEmail,
        addOtp,
        otpByEmail
    }

}

export type UserRepositoryMongoDb = typeof userRepositoryMongoDb