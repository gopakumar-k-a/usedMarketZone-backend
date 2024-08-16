"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = googleUserEntity;
function googleUserEntity(firstName, lastName, email, phone, password, userName) {
    return {
        getFirstName: () => firstName,
        getLastName: () => lastName,
        getUserName: () => userName,
        getEmail: () => email,
        getPhone: () => parseInt(phone),
        getPassword: () => password,
    };
}
