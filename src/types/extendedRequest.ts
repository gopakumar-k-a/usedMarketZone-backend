import { Request } from "express";
import { CreateUserInterface } from "./userInterface";
export interface ExtendedRequest extends Request {
    user?: CreateUserInterface; // Replace with your actual user type
  }