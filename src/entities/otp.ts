
export default function otpEntity(email:string,otp:number) {

    return {
        getEmail: (): string => email,
        getOtp: (): number => otp
    }

}

export type OtpEntityType = ReturnType<typeof otpEntity> 