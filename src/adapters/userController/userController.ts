import asyncHandlder from "express-async-handler"
import { UserDbInterface } from "../../application/repositories/userDbRepository"
import { UserRepositoryMongoDb } from "../../frameworks/database/mongodb/repositories/userRepositoryMongoDb"
import { Request,Response } from "express"

const userController=(
    userDbRepository:UserDbInterface,
    userRepositoryMongoDb:UserRepositoryMongoDb
)=>{

    const dbRepositoryUser=userDbRepository(userRepositoryMongoDb())

    const getUserProfile=asyncHandlder(
        async(req:Request,res:Response)=>{

        }
    )

    return {
        getUserProfile
    }

}


export default userController