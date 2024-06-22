
import express from 'express'
import { productDbRepository } from "../../../application/repositories/productDbRepository"
import { productRepositoryMongoDb } from "../../database/mongodb/repositories/productRepositoryMongoDb"
import { productController } from "../../../adapters/productController/productController"

const productRouter=()=>{
        const router=express.Router()
    const controller=productController(productDbRepository,productRepositoryMongoDb)

    router.post('/post-product',controller.productPost)
    router.get('/get-all-products-posts',controller.getAllPosts)

    return router


    
}

export default productRouter