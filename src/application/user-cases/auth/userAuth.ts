

import { UserDbInterface } from "../../repositories/userDbRepository"

import createUserEntity, { UserEntityType } from "../../../entities/user"



export const userRegister = async (
    user: {
        firstName: string,
        lastName: string,
        email: string,
        phone: string,
        password: string
    },
    userRepository: ReturnType<UserDbInterface>
) => {

    const { firstName, lastName, email, phone, password } = user

    const userEntity: UserEntityType = createUserEntity(
        firstName,
        lastName,
        email,
        phone,
        password
    )
    console.log(userEntity.getLastName);

    const createdUser:any=await userRepository.addUser(userEntity)

    console.log(createdUser);
    

    return createdUser


}