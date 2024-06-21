import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { UserInterface, SignUpUsingOtp } from "../../types/userInterface";
import { UserDbInterface } from "../../application/repositories/userDbRepository";
import { UserRepositoryMongoDb } from "../../frameworks/database/mongodb/repositories/userRepositoryMongoDb";
import { AuthService } from "../../frameworks/services/authService";
import { AuthServiceInterface } from "../../application/services/authServiceInterface";
import AppError from "../../utils/appError";
import { HttpStatusCodes } from "../../types/httpStatusCodes";

import {
  VerifyAndRegister,
  googleAuthenticate,
  sendOtp,
  userAuthenticate,
  forgotPasswordSendOtp,
  verifyForgotPasswordOtp,
  resetPassword,
  resendOtp
} from "../../application/user-cases/auth/auth";

const authController = (
  userDbRepository: UserDbInterface,
  userDbImpl: UserRepositoryMongoDb,
  authService: AuthService,
  authServiceInterface: AuthServiceInterface
) => {
  const dbRepositoryUser = userDbRepository(userDbImpl());

  const userService = authServiceInterface(authService());

  const otpSend = asyncHandler(async (req: Request, res: Response) => {
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "password",
    ];
    const missingFields = requiredFields.filter(
      (field) => !(field in req.body)
    );

    if (missingFields.length > 0) {
      throw new AppError(
        `Missing required fields: ${missingFields.join(", ")}`,
        HttpStatusCodes.BAD_REQUEST
      );
    }

    const userData: any = await sendOtp(
      req.body,
      dbRepositoryUser,
      userService
    );
    console.log(userData);

    res.status(HttpStatusCodes.OK).json({
      status: true,
      message: `otp send successfully`,
      userData,
    });
  });

  
  const resendOtpHandler = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;
  
    if (!email) {
      throw new AppError("Email is required", HttpStatusCodes.BAD_REQUEST);
    }
  
    // const user = await dbRepositoryUser.getUserByEmail(email);
    // if (!user) {
    //   throw new AppError("User not found", HttpStatusCodes.NOT_FOUND);
    // }
  
    const userData = await resendOtp(req.body, dbRepositoryUser, userService);
  
    res.status(HttpStatusCodes.OK).json({
      status: true,
      message: "OTP resent successfully",
      userData
    });
  });
  
  


  const verifyOtpRegister = asyncHandler(
    async (req: Request, res: Response) => {
      const { userData, otp } = req.body;

      const registeredEmail = await VerifyAndRegister(
        userData,
        dbRepositoryUser,
        userService,
        otp
      );
      console.log("registeredEmail ", registeredEmail);

      res.status(HttpStatusCodes.OK).json({
        status: true,
        message: `user registered and otp verified successfully`,
        email: registeredEmail,
      });
    }
  );

  // const sendOtp=asyncHandler(async(req:Request,res:Response)=>{

  // })

  const userLogIn = asyncHandler(async (req: Request, res: Response) => {
    const { email, password }: { email: string; password: string } = req.body;

    if (!email || !password) {
      throw new AppError(
        `all fields are required `,
        HttpStatusCodes.BAD_REQUEST
      );
    }
    const { token, user, role } = await userAuthenticate(
      email,
      password,
      dbRepositoryUser,
      userService
    );

    console.log("user with out pass is ", user);

    res.status(HttpStatusCodes.OK).json({
      status: true,
      message: "success user log in success",
      token,
      user,
      role,
    });
  });

  const googleAuthenticator = asyncHandler(
    async (req: Request, res: Response) => {
      console.log("googleAuthenticator body ", req.body);
      const { token, user, role } = await googleAuthenticate(
        req.body,
        dbRepositoryUser,
        userService
      );

      if (!token || !user || !role) {
        throw new AppError(
          "some thing went wrong please try again ",
          HttpStatusCodes.BAD_REQUEST
        );
      }

      console.log("google authenticator token, user, role ", token, user, role);

      res.status(HttpStatusCodes.OK).json({
        status: true,
        message: "success user log in success",
        token,
        user,
        role,
      });
    }
  );

  const handleForgotPasswordOtpSend = asyncHandler(
    async (req: Request, res: Response) => {
      const { email } = req.body;

      const otpToken = await forgotPasswordSendOtp(
        email,
        dbRepositoryUser,
        userService
      );

      res.status(HttpStatusCodes.OK).json({
        success: "true",
        message: "otp send to user success",
        otpToken,
        email
      });
    }
  );

  const handleForgotPasswordOtpVerify = asyncHandler(
    async (req: Request, res: Response) => {
      const { email, otpToken, otp } = req.body;

      console.log("otp token ", otpToken);
      console.log("otp ", otp);

      const otpCheck = await verifyForgotPasswordOtp(
        otpToken,
        otp,
        dbRepositoryUser,
        userService
      );

      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: "forgot password otp verification success",
        otpCheck,
        email
      });
    }
  );

  const handleResetPassword = asyncHandler(
    async (req: Request, res: Response) => {
      const { email, newPassword } = req.body;
      console.log('email new password ',email,newPassword);
      
      if(!email || !newPassword){
        throw new AppError("All fields are required",HttpStatusCodes.BAD_GATEWAY)
      }
      

      const updateStatus = await resetPassword(
        email,
        newPassword,
        dbRepositoryUser,
        userService
      );

      if (!updateStatus) {
        throw new AppError(
          "something went wrong try again ",
          HttpStatusCodes.UNAUTHORIZED
        );
      }

      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: "password reseted successfully",
      });
    }
  );

  return {
    verifyOtpRegister,
    otpSend,
    resendOtpHandler,
    userLogIn,
    googleAuthenticator,
    handleForgotPasswordOtpSend,
    handleForgotPasswordOtpVerify,
    handleResetPassword,
  };
};

export default authController;
