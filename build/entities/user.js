"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = userEntity;
function userEntity(firstName, lastName, email, phone, password, userName, imageUrl) {
    return {
        getFirstName: () => firstName,
        getLastName: () => lastName,
        getUserName: () => userName,
        getEmail: () => email,
        getPhone: () => parseInt(phone),
        getPassword: () => password,
        getImageUrl: () => imageUrl
    };
}
