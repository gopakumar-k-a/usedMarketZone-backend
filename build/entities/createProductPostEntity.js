"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = postEntity;
function postEntity(productName, basePrice, userId, productImageUrls, category, subCategory, phone, description, productCondition, address, productAge) {
    return {
        getProductName: () => productName,
        getBasePrice: () => parseInt(basePrice),
        getUserId: () => userId,
        getProductImageUrls: () => productImageUrls,
        getCategory: () => category,
        getSubCategory: () => subCategory,
        getPhone: () => parseInt(phone),
        getDescription: () => description,
        getProductCondition: () => productCondition,
        getAddress: () => address,
        getProductAge: () => productAge
    };
}
