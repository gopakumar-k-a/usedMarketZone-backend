import { BidInterface } from "../../repositories/bidRepository";

export const handleGetTransactionDetailsOfBidAdmin = async (
  page: number = 1,
  limit: number = 5,
  searchQuery: string = "",
  sort: string = "",
  shipmentStatus: string,
  paymentStatus: string = "",
  fromDate: string = "",
  toDate: string = "",
  bidRepository: ReturnType<BidInterface>
) => {
  const { transactions, totalDocuments, currentPage } =
    await bidRepository.getTransactionDetailsOfBidEndedProductsAdmin(
      page,
      limit,
      searchQuery,
      sort,
      shipmentStatus,
      paymentStatus,
      fromDate,
      toDate
    );
  return {
    transactions,
    totalDocuments,
    currentPage,
  };
};
