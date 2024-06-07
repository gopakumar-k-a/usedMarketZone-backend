export interface CreateUserInterface {
    _id: string;
    name: string;
    email: string;
    phone: string;
    password: string;
    role:string;
    isActive:boolean;
    createdAt:string;
    updatedAt:string;
    bio:string;
    imageUrl:string;
    __v:number;
}


export interface UserInterface {
    _id:string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
  
}

export interface SignUpUsingOtp{
    user:UserInterface;
    otp:string | number;
}

export interface DecryptInterface{
    payload:string;
    iat:number;
    exp:number
}