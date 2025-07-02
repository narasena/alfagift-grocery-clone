export interface IVoucher {
  id: string;
  name: string;
  description?: string;
  voucherType: EVoucherType;
  discountId?: string;
  discountValueType: EDiscountValueType; //percentage or fixed amount
  discountValue?: number;
  maxTotalDiscountValue?: number;
  userId: string;
  generatorOrderId?: string; // if the order id have min purchase discount scheme
  referralId?: string;
  expiredDate: Date;
  minTransactionTimes?: number; // min number of transaction before voucher can be used
  usageLimitPerUser?: number;
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
