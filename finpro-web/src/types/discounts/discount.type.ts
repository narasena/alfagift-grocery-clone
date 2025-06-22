export enum EDiscountType {
    PERCENTAGE = "PERCENTAGE",
    FIXED = "FIXED",
    BUY1_GET1 = "BUY1_GET1",
    MIN_PURCHASE = "MIN_PURCHASE"
}

export interface IDiscountForm {
    name: string;
    description?: string;
    discountType: EDiscountType;
    discountValue?: number;
    minPurchaseValue?: number;
    buyQuantity?: number;
    getQuantity?: number;
    startDate: Date;
    endDate: Date;
    isGlobalProduct: boolean;
    isGlobalStore: boolean;
    productId?: string
    storeId?: string
    usageLimitPerTransaction?: number
}

export interface IDiscount extends IDiscountForm {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;

}

export interface IVoucherForm {
    name: string;
    description?: string;
    code?: string;
    voucherType: EVoucherType;
    discountId?: string
    discountValue?: number;
    discountValueType?: EDiscountValueType;
    maxTotalDiscountValue?: number;
    userId?: string
    generatorOrderId?: string
    storeId?: string
    referrerId?: string
    referreeId?: string
    expiredDate: Date;
    minTransactionTimes?: number;
    usageLimitPerUser?: number
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
    REFERRAL = "REFERRAL"
}

export enum EDiscountValueType{
    PERCENTAGE = "PERCENTAGE",
    FIXED_AMOUNT = "FIXED_AMOUNT"
}