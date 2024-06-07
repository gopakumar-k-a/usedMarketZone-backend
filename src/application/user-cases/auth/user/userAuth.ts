

import { UserDbInterface } from "../../../repositories/userDbRepository"
import { AuthServiceInterface } from "../../../services/authServiceInterface"
import createUserEntity, { UserEntityType } from "../../../../entities/user"
import AppError from "../../../../utils/appError"
import { HttpStatusCodes } from "../../../../types/httpStatusCodes"
import { generateOTP } from "../../../../utils/generateOtp"
import createOtpEntity, { OtpEntityType } from "../../../../entities/otp"
import { UserInterface, DecryptInterface, CreateUserInterface } from "../../../../types/userInterface"
import omit from 'lodash/omit';

export const VerifyAndRegister = async (
    user: {
        firstName: string,
        lastName: string,
        email: string,
        phone: string,
        password: string
    },
    userRepository: ReturnType<UserDbInterface>,
    userService: ReturnType<AuthServiceInterface>,
    otp: string
) => {


    const otpDoc = await userRepository.otpByEmail(user.email)

    // console.log('otp in db ', otpDoc);

    if (otpDoc && otpDoc.otp == otp) {
        // console.log('verfied otp true')
        user.email = user.email.toLowerCase()

        const isExistingEmail = await userRepository.getUserByEmail(user?.email)

        if (isExistingEmail) {
            throw new AppError('user email already exists', HttpStatusCodes.CONFLICT)
        }

        const decryptedPass = await userService.verifyToken(user.password) as DecryptInterface

        // console.log(typeof decryptedPass, 'typeof decryptedPass');
        // console.log(decryptedPass ,'decryptedPass');

        // // user.password=decryptedPass?.payload
        user.password = await userService.encryptPassword(decryptedPass?.payload)

        console.log('user is ', user);

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

        return createdUser.email
    } else {
        console.log('not verifed ');
        throw new AppError('user not registered Invalid Otp', HttpStatusCodes.CONFLICT)
    }





}




export const sendOtp = async (user: UserInterface,
    userRepository: ReturnType<UserDbInterface>,
    userService: ReturnType<AuthServiceInterface>
) => {

    user.password = userService.generateToken(user.password)
    // user.confirmPassword = null
    console.log(user);

    const otp = generateOTP()
    const otpEntity: OtpEntityType = createOtpEntity(user.email, otp)
    await userRepository.addOtp(otpEntity)
    await userService.sendOtpEmail(user.email, otp)
    return user
}

export const userAuthenticate = async (
    email: string,
    pass: string,
    userRepository: ReturnType<UserDbInterface>,
    userService: ReturnType<AuthServiceInterface>
) => {
    const userData:CreateUserInterface | null= await userRepository.getUserByEmail(
        email
      );
      
   console.log('user is ',userData);
   
      if (!userData) {
        throw new AppError("this user doesn't exist", HttpStatusCodes.UNAUTHORIZED);
      }
    
    //   const applicantId = user?._id;
    
      const isPasswordCorrect = await userService.comparePassword(
        pass,
        userData.password
      )

      if(!isPasswordCorrect){
        throw new AppError("Sorry your password was incorrect",HttpStatusCodes.UNAUTHORIZED)
      }

      const jwtPayload={
        _id:userData._id,
        role:'user'
      }
      const user = omit(userData, 'password');
      console.log('user profile', user);
      
      const token=await userService.generateToken(JSON.stringify(jwtPayload))
      const role=user.role
      
      return {token,user,role}
 


}