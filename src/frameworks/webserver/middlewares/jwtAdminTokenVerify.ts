import { Request, Response, NextFunction } from "express";
import { authServiceInterface } from "../../../application/services/authServiceInterface";
import { authService } from "../../services/authService";
import { userDbRepository } from "../../../application/repositories/userDbRepository";
import { userRepositoryMongoDb } from "../../database/mongodb/repositories/userRepositoryMongoDb";
import AppError from "../../../utils/appError";
import { HttpStatusCodes } from "../../../types/httpStatusCodes";
import { JwtPayload } from "jsonwebtoken";
import { CreateUserInterface } from "../../../types/userInterface";
import { ExtendedAdminRequest } from "../../../types/extendedRequest";

const serviceProvider = authServiceInterface(authService());
const userDb = userDbRepository(userRepositoryMongoDb());

interface CustomJwtPayload extends JwtPayload {
  _id: string;
  role: string;
}

export default async function jwtTokenVerifyAdmin(
  req: ExtendedAdminRequest,
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
    console.log("decoded ", decoded);

    const customPayload = JSON.parse(
      (decoded as any).payload
    ) as CustomJwtPayload;

    // console.log("custom payload ", customPayload);

    // const userData = await userDb.getUserById(customPayload._id);

    // console.log("user data ", userData);

    if (customPayload.role === "admin") {
      // req.admin = customPayload._id as string;
      (req as ExtendedAdminRequest).admin = customPayload._id as string;

      return next();
    } else {
      return next(new AppError("Not authorized", HttpStatusCodes.UNAUTHORIZED));
    }
  } catch (err) {
    console.error(err);
    return next(new AppError("Invalid token", HttpStatusCodes.UNAUTHORIZED));
  }
}
