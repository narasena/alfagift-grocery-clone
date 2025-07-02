import { IProductDetails } from "../products/product.type";
import { IStore } from "../stores/store.type";

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

export enum EVoucherType {
  PRICE_CUT = "PRICE_CUT",
  FREE_SHIPPING = "FREE_SHIPPING",
  REFERRAL = "REFERRAL",
}

export enum EDiscountValueType {
  PERCENTAGE = "PERCENTAGE",
  FIXED_AMOUNT = "FIXED_AMOUNT",
}

export interface IDiscountResponse {
  id: string;
  name: string;
  description?: string;
  discountType: EDiscountType;
  minPurchaseValue?: number;
  startDate: Date;
  endDate: Date;
  isActive?: boolean;
  isGlobalStore: boolean;
  isGlobalProduct: boolean;
  usageLimitPerTransaction?: number;
  productDiscountHistories: IProductDiscountHistory[];
  storeDiscountHistories: IStoreDiscountHistory[];
}

export interface IProductDiscountHistory {
  id: string;
  productId: string;
  discountId: string;
  discountValue: number;
  product: IProductDetails
}

export interface IStoreDiscountHistory {
  id: string;
  storeId: string;
  discountId: string;
  discountValue: number;
  store:IStore
}

export interface IDiscountResponseTable extends IDiscountResponse {
  [key: string]: unknown;
}