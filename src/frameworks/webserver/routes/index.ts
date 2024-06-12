import {Application} from 'express'
import jwtTokenVerfiyUser from '../middlewares/jwtUserTokenVerifyMiddleware';

import authRouter from './auth'
import userRouter from './user';

const routes=(app:Application)=>{
console.log('inside index.ts');

    app.use('/api/auth',authRouter())
    app.use('/api/user',jwtTokenVerfiyUser,userRouter())
}

export default routes