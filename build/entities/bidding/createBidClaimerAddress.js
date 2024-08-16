"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBidClaimerAddressEntity = void 0;
const createBidClaimerAddressEntity = (country, state, district, city, postalCode, phone) => {
    return {
        getCountry: () => country,
        getState: () => state,
        getDistrict: () => district,
        getCity: () => city,
        getPostalCode: () => postalCode,
        getPhone: () => phone,
    };
};
exports.createBidClaimerAddressEntity = createBidClaimerAddressEntity;
