import express from "express";
import { userDbRepository } from '../../../application/repositories/userDbRepository'
import {  userRepositoryMongoDb } from '../../../frameworks/database/mongodb/repositories/userRepositoryMongoDb'
import authController from "../../../adapters/authController/authController";
import { authService } from "../../services/authService";
import { authServiceInterface } from "../../../application/services/authServiceInterface";

const authRouter = () => {
    const router = express.Router();

    console.log('inside auth.ts');

    const controller = authController(
        userDbRepository,
        userRepositoryMongoDb,
        authService,
        authServiceInterface

    )


    router.post('/send-otp',controller.otpSend)
    router.post('/verify-sign-up',controller.verifyOtpRegister)
    router.post('/login',controller.userLogIn)


    

    return router
}

export default authRouter