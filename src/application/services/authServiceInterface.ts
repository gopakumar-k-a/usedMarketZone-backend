
import { AuthServiceReturnType } from "../../frameworks/services/authService"

export const authServiceInterface=(service:AuthServiceReturnType)=>{

    const encryptPassword=(password:string)=>service.encryptPassword(password)

    const comparePassword=(password:string,hashedPassword:string)=>service.comparePassword(password,hashedPassword)

    const generateToken=(payload:any)=>service.generateToken(payload)

    const verifyToken=(token:string)=>service.verifyToken(token)

    const sendOtpEmail=async (email:string,otp:number)=>await service.sendOtpEmail(email,otp)

    // const createUserName=async(firstName:string,lastName:string)=>await 

    return {
        encryptPassword,
        comparePassword,
        generateToken,
        verifyToken,
        sendOtpEmail,
        
    }


}

export type AuthServiceInterface=typeof authServiceInterface