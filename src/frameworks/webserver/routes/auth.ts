import express from "express";

import { Request, Response } from "express";

const authRouter = () => {
    const router = express.Router();

    console.log('inside auth.ts');


    router.post('/signup', (req: Request, res: Response) => {
        console.log('hii');
        
        res.status(200).json({ message: 'success' })
    })

    return router
}

export default authRouter