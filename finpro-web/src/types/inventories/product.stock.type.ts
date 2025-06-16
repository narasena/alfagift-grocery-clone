import { IProductDetails } from "../products/product.type"
import { IStore } from "../stores/store.type"

export interface IProductStock {
    productId: string
    product: IProductDetails
    storeId: string
    store: IStore
    stock: number
    stockHistory?: IProductStockDetail[]
    createdAt: Date
    updatedAt: Date
    deletedAt?: Date
}

export interface IProductStockTable extends IProductStock {
    [key: string]: unknown
}
export interface IProductStockDetailForm {
    quantity: number
    type: EStockMovementType
    reference?: string
    notes?: string
}

export interface IProductStockDetail extends IProductStockDetailForm {
  id: string;
  productId: string;
  storeId: string;
  createdAt: Date;
}

export enum EStockMovementType {
    STORE_IN = "STORE_IN",       // Incoming stock to the store (e.g. from supplier, or main warehouse)
    STORE_OUT = "STORE_OUT",     // Outgoing stock from the store (e.g. damaged or expired products)
    SALE = "SALE",          // Sale of products to customers 
    ADJUSTMENT = "ADJUSTMENT",   // Manual adjustment of stock (e.g. correction of stock count)
}
  
  export interface IProductStockDetailTable extends IProductStockDetail {
    [key: string]: unknown
}
  