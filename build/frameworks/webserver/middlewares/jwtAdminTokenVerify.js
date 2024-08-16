"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = jwtTokenVerifyAdmin;
const authServiceInterface_1 = require("../../../application/services/authServiceInterface");
const authService_1 = require("../../services/authService");
const appError_1 = __importDefault(require("../../../utils/appError"));
const httpStatusCodes_1 = require("../../../types/httpStatusCodes");
const serviceProvider = (0, authServiceInterface_1.authServiceInterface)((0, authService_1.authService)());
async function jwtTokenVerifyAdmin(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return next(new appError_1.default("Unauthorized Entry", httpStatusCodes_1.HttpStatusCodes.UNAUTHORIZED));
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = serviceProvider.verifyToken(token);
        console.log("decoded ", decoded);
        const customPayload = JSON.parse(decoded.payload);
        if (customPayload.role === "admin") {
            req.admin = customPayload._id;
            return next();
        }
        else {
            return next(new appError_1.default("Not authorized", httpStatusCodes_1.HttpStatusCodes.UNAUTHORIZED));
        }
    }
    catch (err) {
        return next(new appError_1.default("Invalid token", httpStatusCodes_1.HttpStatusCodes.UNAUTHORIZED));
    }
}
