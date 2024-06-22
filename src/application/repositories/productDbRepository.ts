
import { ProductRepositoryMongoDb } from "../../frameworks/database/mongodb/repositories/productRepositoryMongoDb"
import { PostEntityType } from "../../entities/createProductPostEntity"


export const productDbRepository=(repository:ReturnType<ProductRepositoryMongoDb>)=>{
    
    const postProduct=async(product:PostEntityType)=>await repository.postProduct(product)
    const getAllProductPost=async()=>await repository.getAllProductPost()
    const updateProductBookmarkCount = async (
        productId: string,
        action: string
      )=>await repository.updateProductBookmarkCount(productId,action)
    return{
        postProduct,
        getAllProductPost,
        updateProductBookmarkCount
    }
}

export type ProductDbInterface=typeof productDbRepository