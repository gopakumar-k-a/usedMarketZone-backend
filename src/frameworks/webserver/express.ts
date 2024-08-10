import express, { Application } from "express";
import cors from "cors";
const cookieParser = require("cookie-parser");
import configKeys from "../../config";
const expressConfig = (app: Application) => {
  const corsOptions = {
    origin: configKeys.CLIENT_URL,
    optionsSuccessStatus: 200,
    credentials: true, // For legacy browser support
  };
  app.use(cookieParser());
  app.use(cors(corsOptions));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
};

export default expressConfig;
