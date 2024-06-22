import { ProductDbRepository } from "../../repositories/productDbRepository"

export const handleGetAllPosts=async(productRepository:ReturnType<ProductDbRepository>)=>{

       const products=await productRepository.getAllProductPost()

       return products

}