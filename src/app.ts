import express, { Application,NextFunction } from 'express';
import connectDB from './frameworks/database/mongodb/connection';
import http from 'http'
import serverConfig from './frameworks/webserver/server';
import expressConfig from './frameworks/webserver/express';
import routes from './frameworks/webserver/routes';
import AppError from './utils/appError';
import errorHandlingMiddleware from './frameworks/webserver/middlewares/errorHandling';

const app: Application = express()

const server = http.createServer(app)

connectDB()

expressConfig(app)

routes(app)
app.use(errorHandlingMiddleware);

// catch 404 and forward to error handler
app.all("*", (req, res, next: NextFunction) => {
    next(new AppError("Not found", 404));
});

serverConfig(server).startServer()