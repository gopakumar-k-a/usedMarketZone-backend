import express from 'express'
import { userDbRepository } from "../../../application/repositories/userDbRepository";
import { UserRepositoryMongoDb, userRepositoryMongoDb } from "../../database/mongodb/repositories/userRepositoryMongoDb";
import userController from '../../../adapters/userController/userController';
const userRouter=()=>{
  const router = express.Router()

  const controller=userController(userDbRepository,userRepositoryMongoDb)

  router
  .route("/profile/:userId")
  .get(controller.getUserProfile)


  return router
  

}


export default userRouter