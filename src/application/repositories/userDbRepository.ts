

import { UserRepositoryMongoDb } from "../../frameworks/database/mongodb/repositories/userRepositoryMongoDb"

// import { UserInterface } from "../../types/userInterface"
import { UserEntityType } from "../../entities/user"


export const userDbRepository=(repository:ReturnType<UserRepositoryMongoDb>)=>{


    const addUser=async(user:UserEntityType)=>repository.addUser(user)

    return {
        addUser
    }
}

export type UserDbInterface=typeof userDbRepository

