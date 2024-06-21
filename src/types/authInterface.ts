import { JwtPayload } from "jsonwebtoken";

export interface JwtForgotPasswordPayload extends JwtPayload {
  email: string;
  otp: number;
}
