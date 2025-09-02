import { IProduct } from "@/types/product.type";

export interface IProductStockHistoryForm {
  productId: string;
  quantity: number;
  type: EStockMovementType;
  reference: string;
  notes: string;
}

export interface IProductStockHistory extends IProductStockHistoryForm {
    storeId: string
}

export enum EStockMovementType {
    STORE_IN = "STORE_IN",
    STORE_OUT = "STORE_OUT",
    SALE = "SALE",
    ADJUSTMENT = "ADJUSTMENT",
}

export interface IProductStock {
    productId: string
    storeId: string
    stock: number
    createdAt: Date
    updatedAt: Date
}


