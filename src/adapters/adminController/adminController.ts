import asyncHandler from "express-async-handler";
import { UserDbInterface } from "../../application/repositories/userDbRepository";
import {
  UserRepositoryMongoDb,
} from "../../frameworks/database/mongodb/repositories/userRepositoryMongoDb";
import { Request, Response } from "express";
import { HttpStatusCodes } from "../../types/httpStatusCodes";
import { getAllUsers } from "../../application/user-cases/user/read";
import { modifyUserAccess } from "../../application/user-cases/user/update";

const adminController = (
  userDbInterface: UserDbInterface,
  userDbImpl: UserRepositoryMongoDb
) => {
  const userDb = userDbInterface(userDbImpl());

  const handleGetUsers = asyncHandler(async (req: Request, res: Response) => {
    // console.log("inside admin controller ", req.params);
    console.log("inside admin controller");

    const page = parseInt(req.params.page) || 1;
    const limit = parseInt(req.params.limit) || 10;
    const startIndex = (page - 1) * limit;

    const { users, totalDocuments } = await getAllUsers(
      startIndex,
      limit,
      userDb
    );

    console.log("users get in get users ", users);
    console.log("total documents in get users ", totalDocuments);

    // const user/

    res.status(HttpStatusCodes.OK).send({
      success: true,
      message: "getting user data success",
      userData: users,
      totalDocuments,
    });
  });

  const handleModifyUserAccess = asyncHandler(async (req: Request, res: Response) => {
    const { userId }= req.params;

    const updatedUser=await modifyUserAccess(userId,userDb)
    console.log('updatedUser handleModifyUserAccess',updatedUser);
    

    res.status(HttpStatusCodes.OK).send({
      success:true,
      message:"changed user access",
      updatedUser

    })
  });

  return {
    handleGetUsers,
    handleModifyUserAccess,
  };
};

export default adminController;
