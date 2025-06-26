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

export interface IDiscount extends IDiscountForm {
  id: string;
  buyQuantity?: number;
  getQuantity?: number;
  productId?: string;
  storeId?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface IVoucherForm {
  name: string;
  description?: string;
  code?: string;
  voucherType: EVoucherType;
  discountId?: string;
  discountValue?: number;
  discountValueType?: EDiscountValueType;
  maxTotalDiscountValue?: number;
  userId?: string;
  generatorOrderId?: string;
  storeId?: string;
  referrerId?: string;
  referreeId?: string;
  expiredDate: Date;
  minTransactionTimes?: number;
  usageLimitPerUser?: number;
  totalUsageLimit?: number;
}

export interface IVoucher extends IVoucherForm {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export enum EVoucherType {
  PRICE_CUT = "PRICE_CUT",
  FREE_SHIPPING = "FREE_SHIPPING",
  REFERRAL = "REFERRAL",
}

export enum EDiscountValueType {
  PERCENTAGE = "PERCENTAGE",
  FIXED_AMOUNT = "FIXED_AMOUNT",
}
