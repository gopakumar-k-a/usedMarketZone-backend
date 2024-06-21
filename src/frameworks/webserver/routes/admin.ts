import express from "express";
import adminController from "../../../adapters/adminController/adminController";
import { userDbRepository } from "../../../application/repositories/userDbRepository";
import { userRepositoryMongoDb } from "../../../frameworks/database/mongodb/repositories/userRepositoryMongoDb";

const adminRouter = () => {
  const router = express.Router();
  const controller = adminController(userDbRepository, userRepositoryMongoDb);

  router.get("/get-all-users/:page/:limit", controller.handleGetUsers);
  router.get("/block-user/:userId", controller.handleModifyUserAccess);

  return router;
};

export default adminRouter;
