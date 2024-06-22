
import { ProductRepositoryMongoDb } from "../../frameworks/database/mongodb/repositories/productRepositoryMongoDb"
import { PostEntityType } from "../../entities/createProductPostEntity"


export const productDbRepository=(repository:ReturnType<ProductRepositoryMongoDb>)=>{
    
    const postProduct=async(product:PostEntityType)=>await repository.postProduct(product)
    const getAllProductPost=async()=>repository.getAllProductPost()
    return{
        postProduct,
        getAllProductPost
    }
}

export type ProductDbRepository=typeof productDbRepository