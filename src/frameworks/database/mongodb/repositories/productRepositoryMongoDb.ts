import Product from "../models/productModel";
import { PostEntityType } from "../../../../entities/createProductPostEntity";
export const productRepositoryMongoDb = () => {
  const postProduct = async (product: PostEntityType) => {
    const productData = {
      productName: product.getProductName(),
      basePrice: product.getBasePrice(),
      userId: product.getUserId(),
      productImageUrls: product.getProductImageUrls(),
      category: product.getCategory(),
      subCategory: product.getSubCategory(),
      phone: product.getPhone(),
      description: product.getDescription(),
      productCondition: product.getProductCondition(),
      address: product.getAddress(),
      productAge: product.getProductAge(),
    };

    // Save to the database
    const newProduct = new Product(productData);
    console.log("newProduct ", newProduct);

    await newProduct.save();

    return newProduct;
  };

  const getAllProductPost = async () => {
    const products = await Product.aggregate([
      {
        $lookup: {
          from: "users", // The collection name in MongoDB is usually the model name in lowercase and pluralized
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: "$userDetails",
      },
      {
        $project: {
          _id: 1,
          productName: 1,
          basePrice: 1,
          userId: 1,
          productImageUrls: 1,
          category: 1,
          subCategory: 1,
          phone: 1,
          description: 1,
          productCondition: 1,
          productAge: 1,
          bookmarkedCount: 1,
          "userDetails.userName": 1,
          "userDetails.imageUrl": 1,
        },
      },
      {
        $sort: {
          createdAt: -1 
        },
      },
    ]);

    console.log('products ',products);
    
    return products;
  };

  return {
    postProduct,
    getAllProductPost,
  };
};

export type ProductRepositoryMongoDb = typeof productRepositoryMongoDb;
