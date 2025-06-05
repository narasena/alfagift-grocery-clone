import { IProductBrand } from "./product.brand.type";
import { IProductSubCategory } from "./product.category.type";
import { IProductImage } from "./product.image.type";

export interface IAddProductField {
  name: string;
  title: string;
  type: string;
  options?: IProductSubCategory[];
}

export interface IProduct {
  id: number;
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

export interface ICloudinaryResult {
  public_id: string;
  secure_url: string;
  isMainImage: boolean;
}

export interface IProductDetails extends IProduct {
  productImage: IProductImage[];
  productSubCategory: IProductSubCategory & { productCategory: IProductSubCategory };
  productBrand: IProductBrand;
}
