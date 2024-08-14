import { Response, NextFunction } from "express";
import { authServiceInterface } from "../../../application/services/authServiceInterface";
import { authService } from "../../services/authService";
import AppError from "../../../utils/appError";
import { HttpStatusCodes } from "../../../types/httpStatusCodes";
import { JwtPayload } from "jsonwebtoken";
import { ExtendedAdminRequest } from "../../../types/extendedRequest";

const serviceProvider = authServiceInterface(authService());

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

    if (customPayload.role === "admin") {
      (req as ExtendedAdminRequest).admin = customPayload._id as string;

      return next();
    } else {
      return next(new AppError("Not authorized", HttpStatusCodes.UNAUTHORIZED));
    }
  } catch (err) {
    return next(new AppError("Invalid token", HttpStatusCodes.UNAUTHORIZED));
  }
}
