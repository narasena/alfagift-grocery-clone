import { IProductStock } from "../inventories/product.stock.type";
import { IProduct, IProductDetails } from "../products/product.type";
import { IStore } from "../stores/store.type";

export interface ICartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  productStock: IProductStock & {
    product:
      | IProductDetails
      | (IProduct & {
          productDiscount: string[];
        });
  };
  store: IStore;
}
