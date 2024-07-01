export interface ProductPostForm {
    productName: string;
    basePrice: string;
    category: string;
    subCategory: string;
    description: string;
    productCondition: string;
    productImageUrls: string[];
    phone: string;
    address: string;
    productAge:string;
    bidDuration:{
      day:number;
      hour:number;
      minute:number;
    }
  }

  export interface BidDuration{
    day:number;
    hour:number;
    minute:number;
  }
  