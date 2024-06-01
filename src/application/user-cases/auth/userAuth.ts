

import { UserDbInterface } from "../../repositories/userDbRepository"
import { AuthServiceInterface } from "../../services/authServiceInterface"
import createUserEntity, { UserEntityType } from "../../../entities/user"
import AppError from "../../../utils/appError"
import { HttpStatusCodes } from "../../../types/httpStatusCodes"
import { generateOTP } from "../../../utils/generateOtp"
import createOtpEntity,{ OtpEntityType } from "../../../entities/otp"


export const userRegister = async (
    user: {
        firstName: string,
        lastName: string,
        email: string,
        phone: string,
        password: string
    },
    userRepository: ReturnType<UserDbInterface>,
    userService: ReturnType<AuthServiceInterface>
) => {

    user.email = user.email.toLowerCase()

    const isExistingEmail = await userRepository.getUserByEmail(user?.email)

    if (isExistingEmail) {
        throw new AppError('user email already exists', HttpStatusCodes.CONFLICT)
    }

    user.password = await userService.encryptPassword(user?.password)
    const { firstName, lastName, email, phone, password } = user

    const userEntity: UserEntityType = createUserEntity(
        firstName,
        lastName,
        email,
        phone,
        password
    )
    console.log(userEntity.getLastName());

    const createdUser: any = await userRepository.addUser(userEntity)

    console.log(createdUser);




    return createdUser


}

export const sendOtp = async (email: string,
    userRepository: ReturnType<UserDbInterface>,
    userService: ReturnType<AuthServiceInterface>
) => {

    const userInDb = await userRepository.getUserByEmail(email)

    if (!userInDb) {
        throw new AppError('user is not registered', HttpStatusCodes.BAD_REQUEST)
    }

    if (userInDb?.isVerified) {
        throw new AppError('user already verified the account', HttpStatusCodes.ALREADY_REPORTED)
    }
    const otp = generateOTP()

    const otpEntity: OtpEntityType = createOtpEntity(email,otp)
    

    await userRepository.addOtp(otpEntity)

    const otpStatus = await userService.sendOtpEmail(email, otp)


    return otpStatus
}