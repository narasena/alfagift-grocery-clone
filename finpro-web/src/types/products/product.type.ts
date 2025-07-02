import { EDiscountType, TDiscountType } from "../discounts/discount.type";
import { EStockMovementType } from "../inventories/product.stock.type";
import { IStore } from "../stores/store.type";
import { IProductBrand } from "./product.brand.type";
import { IProductSubCategory } from "./product.category.type";
import { ICloudinaryResult, IProductImage } from "./product.image.type";

export interface IAddProductField {
  name: string;
  title: string;
  type: string;
  options?: IProductSubCategory[];
}

export interface IProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  productSubCategoryId: number;
  brandId?: string;
  description?: string;
  sku?: string;
  barcode?: string;
  weight?: number;
  dimensions?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
export interface IProductFormValues extends IProduct {
  images: ICloudinaryResult[];
}

export interface IProductDiscountHistory {
  name: string;
  description: string;
  discountValue: number;
  discountedPrice: number;
  discount: {
    id: string;
    name: string;
    discountType: EDiscountType;
  }
}

export interface IProductDetails extends IProduct {
  productImage: IProductImage[];
  productSubCategory: IProductSubCategory & { productCategory: IProductSubCategory };
  productBrand: IProductBrand;
  productStock: {
    storeId: string;
    stock: number;
  };
  productDiscountHistories: IProductDiscountHistory[];
}

export interface IProductTable extends IProduct {
  [key: string]: unknown;
}

export interface IProductDetailsTable extends IProductDetails {
  [key: string]: unknown;
}

export interface IProductStockReport {
  product: IProductDetails;
  store: IStore;
  productId: string;
  storeId: string;
}

export interface IProductStockReportTotal extends IProductStockReport {
  stock: number;
  stockReportLength: number;
  storeInQuantity: number;
  storeOutQuantity: number;
}

export interface IProductStockReportMonthly extends IProductStockReport {
  productStock: {
    product: IProductDetails;
    store: IStore;
  };
  type: EStockMovementType;
  quantity: number;
  createdAt: Date;
}

export type TProductStockReport = IProductStockReportTotal | IProductStockReportMonthly;

export type TProductStockReportTable = TProductStockReport & {
  [key: string]: unknown;
};
