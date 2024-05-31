import asyncHandler from "express-async-handler";

import { Request, Response } from "express";




import {CreateUserInterface,UserInterface} from '../../types/userInterface'


import { UserDbInterface } from "../../application/repositories/userDbRepository";
import { UserRepositoryMongoDb } from "../../frameworks/database/mongodb/repositories/userRepositoryMongoDb";
import { userRegister } from "../../application/user-cases/auth/userAuth";
import { AuthService } from "../../frameworks/services/authService";
import { AuthServiceInterface } from "../../application/services/authServiceInterface";
const authController=(
    userDbRepository:UserDbInterface,
    userRepositoryMongoDb:UserRepositoryMongoDb,
    authService:AuthService,
    authServiceInterface:AuthServiceInterface
)=>{

    const dbRepositoryUser=userDbRepository(userRepositoryMongoDb())

    const userService=authServiceInterface(authService())


    const registerUser=asyncHandler(async(req:Request,res:Response)=>{
        const user:UserInterface=req.body

        console.log('user in auth controller ',user)

        const newUser:any=await userRegister(user,dbRepositoryUser)

        res.status(200).json({
            message:'success',
            newUser
        })
        
    })


    return {
        registerUser
    }


   
}


export default authController