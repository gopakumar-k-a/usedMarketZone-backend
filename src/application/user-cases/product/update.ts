import { ProductPostForm } from "../../../types/product";
import postEntity from "../../../entities/createProductPostEntity";
import { ProductDbRepository } from "../../repositories/productDbRepository";

export const handlePostProduct = async (
  postData: ProductPostForm,
  userId: string,
  productRepository: ReturnType<ProductDbRepository>
) => {
  const {
    productName,
    basePrice,
    productImageUrls,
    category,
    subCategory,
    phone,
    description,
    productCondition,
    address,
    productAge,
  } = postData;

  const createPostEntity = postEntity(
    productName,
    basePrice,
    userId,
    productImageUrls,
    category,
    subCategory,
    phone,
    description,
    productCondition,
    address,
    productAge
  );

  console.log("createPostEntity ", createPostEntity);

  await productRepository.postProduct(createPostEntity);
  return;
};
