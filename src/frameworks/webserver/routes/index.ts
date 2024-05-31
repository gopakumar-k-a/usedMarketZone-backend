import {Application} from 'express'

import authRouter from './auth'

const routes=(app:Application)=>{
console.log('inside index.ts');

    app.use('/api/auth',authRouter())
}

export default routes