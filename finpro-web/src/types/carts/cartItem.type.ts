import { IProductStock } from "../inventories/product.stock.type";
import { IProduct, IProductDetails } from "../products/product.type";
import { IStore } from "../stores/store.type";

export interface ICartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  productStock?: IProductStock & {
    product:
      | IProductDetails
      | (IProduct & {
          productDiscount: string[];
        });
  };
  store?: IStore;
}

export interface ICartItemResponse {
  id: string;
  cartId: string;
  productId: string;
  storeId: string;
  quantity: number;
  status: ECartItemStatus;
  product: IProductDetails;
  productStock: IProductStock;
  subTotal: number;
  discountInPrice: number;
  finalPrice: number;

}

export enum ECartItemStatus {
  ACTIVE = "ACTIVE",
  ORDERED = "ORDERED",
  REMOVED = "REMOVED"
}
