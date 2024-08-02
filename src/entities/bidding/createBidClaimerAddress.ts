export const createBidClaimerAddressEntity = (
  country: string,
  state: string,
  district: string,
  city: string,
  postalCode: string,
  phone: string
) => {
  return {
    getCountry: (): string => country,
    getState: (): string => state,
    getDistrict: (): string => district,
    getCity: (): string => city,
    getPostalCode: (): string => postalCode,
    getPhone: (): string => phone,
  };
};

export type CreateBidClaimerAddressEntityType = ReturnType<
  typeof createBidClaimerAddressEntity
>;
