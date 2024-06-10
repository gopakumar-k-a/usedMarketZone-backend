import { Request, Response, NextFunction } from "express";
import { authServiceInterface } from "../../../application/services/authServiceInterface";
import { authService } from "../../services/authService";
import { userDbRepository } from "../../../application/repositories/userDbRepository";
import { userRepositoryMongoDb } from "../../database/mongodb/repositories/userRepositoryMongoDb";
import AppError from "../../../utils/appError";
import { HttpStatusCodes } from "../../../types/httpStatusCodes";
const serviceProvider = authServiceInterface(authService());
const userDb=userDbRepository(userRepositoryMongoDb())

export default async function jwtTokenVerfiyUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError("UnAuthorised Entry", HttpStatusCodes.UNAUTHORIZED);
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = serviceProvider.verifyToken(token)
    // req.user = await userDb.getUserByI
    next();
  } catch (err) {
    console.log(err);
    res.status(403).json({ message: "Invalid token" });
    throw new AppError("Not authorized", HttpStatusCodes.UNAUTHORIZED);
  }
}

// async function verifyToken(req, res, next) {
//     const authHeader = req.headers.authorization;
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//         return res.status(401).json({ message: 'Unauthorized' });
//     }
//     const token = authHeader.split(' ')[1];
//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = await userModel.findOne({ _id: decoded.id }).select('-password')
//         next();
//     } catch (err) {
//         console.log(err);
//         res.status(403).json({ message: 'Invalid token' });
//         throw new Error('Not authorized')
//     }
// }
