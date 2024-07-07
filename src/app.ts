import express, { Application, NextFunction } from "express";
import connectDB from "./frameworks/database/mongodb/connection";
import http from "http";
import { Server } from "socket.io";
import serverConfig from "./frameworks/webserver/server";
import expressConfig from "./frameworks/webserver/express";
import routes from "./frameworks/webserver/routes";
import AppError from "./utils/appError";
import errorHandlingMiddleware from "./frameworks/webserver/middlewares/errorHandling";
import socketConfig from "./frameworks/webSocket/socket";

const app: Application = express();

const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

socketConfig(io);
connectDB();

expressConfig(app);

routes(app);

// catch 404 and forward to error handler
app.use(errorHandlingMiddleware);
app.all("*", (req, res, next: NextFunction) => {
  next(new AppError("Not found", 404));
});

serverConfig(server).startServer();
