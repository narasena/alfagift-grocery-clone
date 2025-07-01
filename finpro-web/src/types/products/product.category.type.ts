export interface IProductCategory {
    id: number
    name: string
    slug: string
    description?: string
    createdAt: Date
    updatedAt: Date
    deletedAt?: Date
}

export interface IProductSubCategory extends IProductCategory {
  productCategoryId: number;
}

interface IProductImage {
  imageUrl: string
}

interface IProductStock {
  stock: number
}

interface IProductDiscountHistory {
  discountValue: number
}

export interface IProductDetailsCategoryResponse {
  name: string
  slug: string
  price: number
  description: string | null
  productImage: IProductImage[]
  productStock: IProductStock[]
  productDiscountHistories: IProductDiscountHistory[]
}

interface IProductSubCategoryWithProducts {
  name: string;
  slug: string;
  product: IProductDetailsCategoryResponse[];
}

export interface IProductCategoryResponse {
  name: string
  slug: string
  productSubCategory: IProductSubCategoryWithProducts[]
}

export interface IProductSubCategoryResponse {
  name: string;
  slug: string;
  productCategory: {
    name: string;
    slug: string;
  };
  product: IProductDetailsCategoryResponse[];
}