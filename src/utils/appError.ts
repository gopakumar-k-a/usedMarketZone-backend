

import { HttpStatusCodes } from "../types/httpStatusCodes";

class AppError extends Error{
    statusCode:number;
    status:string;
    isOperational:boolean;

    constructor(message:string,statusCode:HttpStatusCodes){
        super(message)
        this.statusCode=statusCode
        this.status=`${statusCode}`.startsWith('4')?'fail':'success'
        this.isOperational=true

        Error.captureStackTrace(this,this.constructor)
    }

}

export default AppError