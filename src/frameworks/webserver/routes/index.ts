import { Application } from "express";
import jwtTokenVerfiyUser from "../middlewares/jwtUserTokenVerifyMiddleware";
import jwtTokenVerifyAdmin from "../middlewares/jwtAdminTokenVerify";

import authRouter from "./auth";
import userRouter from "./user";
import adminRouter from "./admin";
import productRouter from "./product";
import bidRouter from "./bid";

const routes = (app: Application) => {
  console.log("inside index.ts");

  app.use("/api/auth", authRouter());
  app.use("/api/user", jwtTokenVerfiyUser, userRouter());
  app.use("/api/admin", jwtTokenVerifyAdmin, adminRouter());
  app.use("/api/product",jwtTokenVerfiyUser,productRouter());
  app.use("/api/bid",jwtTokenVerfiyUser,bidRouter())
};

export default routes;
