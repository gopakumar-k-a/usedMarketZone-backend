export default function postEntity(
    productName:string,
    basePrice:string,
    userId:string,
    productImageUrls:string[],
    category:string,
    subCategory:string,
    phone:string,
    description:string,
    productCondition:string,
    address:string,
    productAge:string
){
    return {
        getProductName:():string=>productName,
        getBasePrice:():number=>parseInt(basePrice),
        getUserId:():string=>userId,
        getProductImageUrls:():string[]=>productImageUrls,
        getCategory:():string=>category,
        getSubCategory:():string=>subCategory,
        getPhone:():number=>parseInt(phone),
        getDescription:():string=>description,
        getProductCondition:():string=>productCondition,
        getAddress:():string=>address,
        getProductAge:():string=>productAge
      }

    

}

export type PostEntityType=ReturnType<typeof postEntity>