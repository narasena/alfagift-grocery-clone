import { IProductSubCategory } from "./product.subcategory.type";

export interface IAddProductField {
  name: string;
  title: string;
  type: string;
  options?: IProductSubCategory[];
};

export interface IProductFormValues {
  name: string;
  price: number;
  productSubCategoryId: number;
  brandId?: string;
  description?: string;
  sku?: string;
  barcode?: string;
  weight?: number;
  dimensions?: string;
  images: ICloudinaryResult[];
};

export interface ICloudinaryResult {
  public_id: string;
  secure_url: string;
  isMainImage: boolean;
};