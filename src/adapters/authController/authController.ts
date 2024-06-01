import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { UserInterface } from '../../types/userInterface'
import { UserDbInterface } from "../../application/repositories/userDbRepository";
import { UserRepositoryMongoDb } from "../../frameworks/database/mongodb/repositories/userRepositoryMongoDb";
import { AuthService } from "../../frameworks/services/authService";
import { AuthServiceInterface } from "../../application/services/authServiceInterface";
import AppError from "../../utils/appError";
import { HttpStatusCodes } from "../../types/httpStatusCodes";

import {
    userRegister,
    sendOtp,
} from "../../application/user-cases/auth/userAuth";

const authController = (
    userDbRepository: UserDbInterface,
    userRepositoryMongoDb: UserRepositoryMongoDb,
    authService: AuthService,
    authServiceInterface: AuthServiceInterface
) => {

    const dbRepositoryUser = userDbRepository(userRepositoryMongoDb())

    const userService = authServiceInterface(authService())


    const registerUser = asyncHandler(async (req: Request, res: Response) => {

        const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'password'];
        const missingFields = requiredFields.filter(field => !(field in req.body));

        if (missingFields.length > 0) {
            throw new AppError(`Missing required fields: ${missingFields.join(', ')}`, HttpStatusCodes.BAD_REQUEST);
        }

        const user: UserInterface = req.body
        console.log('user in auth controller ', user)

        const createdUser = await userRegister(user, dbRepositoryUser, userService)

        await sendOtp(createdUser.email, dbRepositoryUser, userService)


        res.status(200).json({
            status: true,
            message: `user registered otp send successfully`,

        })

    })

    // const sendOtp=asyncHandler(async(req:Request,res:Response)=>{



    // })


    return {
        registerUser
    }



}


export default authController