"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleSearchOnApp = void 0;
const mongoose_1 = require("mongoose");
const handleSearchOnApp = async (dbUser, dbProduct, userId, searchQuery, filter, subFilter = "") => {
    let results;
    if (filter === "users") {
        results = await dbUser.searchUser(searchQuery, userId);
    }
    else if (filter === "posts") {
        const isBidding = subFilter === "bidding";
        results = await dbProduct.searchProduct(searchQuery, isBidding, new mongoose_1.Types.ObjectId(userId));
    }
    return results;
};
exports.handleSearchOnApp = handleSearchOnApp;
