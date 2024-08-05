import { PostReportDbInterface } from "../../repositories/postReportRepository";
import { ProductDbInterface } from "../../repositories/productDbRepository";
import { UserDbInterface } from "../../repositories/userDbRepository";

export const handleGetAdminStatistics = async (
  postReportDb: ReturnType<PostReportDbInterface>,
  productDb: ReturnType<ProductDbInterface>,
  userDb: ReturnType<UserDbInterface>
) => {
  const [numberOfReportsResult, numberOfProductsResult, numberOfUsersResult] =
    await Promise.all([
      postReportDb.getNumberOfPostReports(),
      productDb.getNumberOfProducts(),
      userDb.getNumberOfUsers(),
    ]);

    const statistics = {
        numberOfReports: numberOfReportsResult.numberOfReports,
        numberOfProducts: numberOfProductsResult.numberOfProducts,
        numberOfBidProducts: numberOfProductsResult.numberOfBidProducts,
        numberOfNonBidProducts: numberOfProductsResult.numberOfNonBidProducts,
        numberOfUsers: numberOfUsersResult.numberOfUsers,
      };

  return statistics;
};


