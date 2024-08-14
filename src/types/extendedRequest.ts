import { Request } from "express";
import { CreateUserInterface } from "./userInterface";
export interface ExtendedRequest extends Request {
  user?: CreateUserInterface; 
}

export interface ExtendedAdminRequest extends Request{
  admin?: string;
}
