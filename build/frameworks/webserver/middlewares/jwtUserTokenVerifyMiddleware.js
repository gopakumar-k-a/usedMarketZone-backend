"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = jwtTokenVerifyUser;
const authServiceInterface_1 = require("../../../application/services/authServiceInterface");
const authService_1 = require("../../services/authService");
const userDbRepository_1 = require("../../../application/repositories/userDbRepository");
const userRepositoryMongoDb_1 = require("../../database/mongodb/repositories/userRepositoryMongoDb");
const appError_1 = __importDefault(require("../../../utils/appError"));
const httpStatusCodes_1 = require("../../../types/httpStatusCodes");
const serviceProvider = (0, authServiceInterface_1.authServiceInterface)((0, authService_1.authService)());
const userDb = (0, userDbRepository_1.userDbRepository)((0, userRepositoryMongoDb_1.userRepositoryMongoDb)());
async function jwtTokenVerifyUser(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return next(new appError_1.default("Unauthorized Entry", httpStatusCodes_1.HttpStatusCodes.UNAUTHORIZED));
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = serviceProvider.verifyToken(token);
        const customPayload = JSON.parse(decoded.payload);
        const userData = await userDb.getUserWithOutPass(customPayload._id);
        if (userData && userData.role === "user" && userData.isActive) {
            req.user = userData.toObject();
            return next();
        }
        else {
            return next(new appError_1.default("User is blocked", httpStatusCodes_1.HttpStatusCodes.UNAUTHORIZED));
        }
    }
    catch (err) {
        return next(new appError_1.default("Invalid token", httpStatusCodes_1.HttpStatusCodes.UNAUTHORIZED));
    }
}
