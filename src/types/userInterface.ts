export interface CreateUserInterface {
  _id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  bio: string;
  imageUrl: string;
  __v: number;
}
export interface IUser {}

export interface UserInterface {

  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password?: string;

  userName?: string;

  role?: string;
  isActive?: boolean;
  bio?: string;
  imageUrl?: string;
  followers?: string[]; 
  following?: string[]; 
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SignUpUsingOtp {
  user: UserInterface;
  otp: string | number;
}

export interface DecryptInterface {
  payload: string;
  iat: number;
  exp: number;
}
