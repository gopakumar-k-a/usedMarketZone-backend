import { Request, Response, NextFunction } from "express";
import { authServiceInterface } from "../../../application/services/authServiceInterface";
import { authService } from "../../services/authService";
import { userDbRepository } from "../../../application/repositories/userDbRepository";
import { userRepositoryMongoDb } from "../../database/mongodb/repositories/userRepositoryMongoDb";
import AppError from "../../../utils/appError";
import { HttpStatusCodes } from "../../../types/httpStatusCodes";
import { JwtPayload } from "jsonwebtoken";
import { CreateUserInterface } from "../../../types/userInterface";

const serviceProvider = authServiceInterface(authService());
const userDb = userDbRepository(userRepositoryMongoDb());

export interface CustomJwtPayload extends JwtPayload {
  _id: string;
  role: string;
}

interface ExtendedRequest extends Request {
  user?: CreateUserInterface;
}

export default async function jwtTokenVerifyUser(
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(
      new AppError("Unauthorized Entry", HttpStatusCodes.UNAUTHORIZED)
    );
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = serviceProvider.verifyToken(token);

    const customPayload = JSON.parse(
      (decoded as any).payload
    ) as CustomJwtPayload;

    const userData = await userDb.getUserWithOutPass(customPayload._id);

    if (userData && userData.role === "user" && userData.isActive) {
      req.user = userData.toObject() as CreateUserInterface;
      return next();
    } else {
      return next(
        new AppError("User is blocked", HttpStatusCodes.UNAUTHORIZED)
      );
    }
  } catch (err) {
    return next(new AppError("Invalid token", HttpStatusCodes.UNAUTHORIZED));
  }
}
