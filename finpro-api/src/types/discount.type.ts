export enum EDiscountType {
  PERCENTAGE = "PERCENTAGE",
  FIXED_AMOUNT = "FIXED_AMOUNT",
  BUY1_GET1 = "BUY1_GET1",
  MIN_PURCHASE = "MIN_PURCHASE",
}
export type TDiscountType = keyof typeof EDiscountType;

export interface IDiscountForm {
  name: string;
  description?: string;
  discountType: TDiscountType | "";
  discountValue?: number;
  minPurchaseValue?: number;
  startDate: string;
  endDate: string;
  isGlobalProduct: boolean;
  isGlobalStore: boolean;
  usageLimitPerTransaction?: number;
}

export interface IPriceCutSelectedProduct {
  discountValue: number;
  productIds: string[];
}

export interface IAddDiscountForm extends IDiscountForm {
  selectedProducts: string[];
  selectedStores: string[];
  toBeDiscountedProducts: IPriceCutSelectedProduct[];
}
