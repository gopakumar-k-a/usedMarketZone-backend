import { UserDbInterface } from "../../repositories/userDbRepository";
import { ProductDbInterface } from "../../repositories/productDbRepository";
import { Types } from "mongoose";

export const handleSearchOnApp = async (
  dbUser: ReturnType<UserDbInterface>,
  dbProduct: ReturnType<ProductDbInterface>,
  userId: string,
  searchQuery: string,
  filter: string,
  subFilter: string | null = ""
) => {
  let results;
  if (filter === "users") {
    results = await dbUser.searchUser(searchQuery,userId);
  } else if (filter === "posts") {
    const isBidding = subFilter === "bidding";
    results = await dbProduct.searchProduct(searchQuery, isBidding,new Types.ObjectId(userId));
  }

  return results;
};
