"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createKycEntity = void 0;
const mongoose_1 = require("mongoose");
const createKycEntity = (name, userId, dob, idType, idNumber, phone) => {
    return {
        getName: () => name,
        getUserId: () => new mongoose_1.Types.ObjectId(userId),
        getDob: () => new Date(dob),
        getIdType: () => idType,
        getIdNumber: () => idNumber,
        getPhone: () => phone,
    };
};
exports.createKycEntity = createKycEntity;
