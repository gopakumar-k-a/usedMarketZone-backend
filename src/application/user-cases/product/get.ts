import { ProductDbInterface } from "../../repositories/productDbRepository"

export const handleGetAllPosts=async(productRepository:ReturnType<ProductDbInterface>)=>{

       const products=await productRepository.getAllProductPost()

       return products

}


