import AppError from "../../../utils/appError";
import { Request,Response ,NextFunction} from "express";

const errorHandlingMiddleware=(err:AppError,req:Request,res:Response,next:NextFunction)=>{
    
    err.status = err.status || 'error';
    err.statusCode = err.statusCode || 500;
    console.log('inside errorHandlingMiddleware',err.message);
    
    if (err.statusCode === 404) {

        res.status(err.statusCode).json({ errors: err.status, errorMessage: err.message })
    } else {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        })
    }

}

export default errorHandlingMiddleware