

import User from "../models/userModel"


import { UserEntityType } from "../../../../entities/user"


export const userRepositoryMongoDb = () => {



    const addUser = async (user: UserEntityType) => {
        const newUser: any = new User({
            firstName: user.getFirstName(),
            lastName: user.getLastName(),
            email: user.getEmail(),
            phone: user.getPassword(),
            password: user.getPassword()
        })

        await newUser.save()

        return newUser
    }

    return {
        addUser
    }

}

export type UserRepositoryMongoDb = typeof userRepositoryMongoDb