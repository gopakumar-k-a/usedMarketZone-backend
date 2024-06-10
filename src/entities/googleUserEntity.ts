import { Interface } from "readline";

export default function googleUserEntity(
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    password: string,
    userName: string
){
    return {
        getFirstName: (): string => firstName,
        getLastName: (): string => lastName,
        getUserName: (): string => userName,
        getEmail: (): string => email,
        getPhone: (): number => parseInt(phone),
        getPassword: (): string => password,
      };
}

export type GoogleUserEntityType=typeof googleUserEntity

