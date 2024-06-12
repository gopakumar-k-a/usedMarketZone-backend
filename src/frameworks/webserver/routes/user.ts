import express from 'express'
import { userDbRepository } from "../../../application/repositories/userDbRepository";
import { UserRepositoryMongoDb, userRepositoryMongoDb } from "../../database/mongodb/repositories/userRepositoryMongoDb";
import userController from '../../../adapters/userController/userController';

const userRouter=()=>{
  const router = express.Router()

  const controller=userController(userDbRepository,userRepositoryMongoDb)

  router
  .route("/profile/:userId")
  .get(controller.handleGetUserProfile)
  router.put("/edit-profile/:userId",controller.handleProfileUpdate)
  
  router.put("/edit-profile/update-image/:userId",controller.handleProfileImageUpdate)


  router.get("/username-check/:userName/:userId",controller.handleUserNameCheck)

  return router
  

}


export default userRouter