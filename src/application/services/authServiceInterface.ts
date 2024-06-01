
import { AuthServiceReturnType } from "../../frameworks/services/authService"

export const authServiceInterface=(service:AuthServiceReturnType)=>{

    const encryptPassword=(password:string)=>service.encryptPassword(password)

    const comparePassword=(password:string,hashedPassword:string)=>service.comparePassword(password,hashedPassword)

    const generateToken=(payload:string)=>service.generateToken(payload)

    const verifyToken=(token:string)=>service.verifyToken(token)

    const sendOtpEmail=async (email:string,otp:number)=>await service.sendOtpEmail(email,otp)

    return {
        encryptPassword,
        comparePassword,
        generateToken,
        verifyToken,
        sendOtpEmail
    }


}

export type AuthServiceInterface=typeof authServiceInterface