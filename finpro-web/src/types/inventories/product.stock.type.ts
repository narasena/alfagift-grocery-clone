import { IProductDetails } from "../products/product.type"
import { IStore } from "../stores/store.type"

export interface IProductStock {
    productId: string
    product: IProductDetails
    storeId: string
    store: IStore
    stock: number
    createdAt: Date
    updatedAt: Date
    deletedAt?: Date
}

export interface IProductStockTable extends IProductStock {
    [key: string]: unknown
}