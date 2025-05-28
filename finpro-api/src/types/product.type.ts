export interface IProduct {
    id: string;
    name: string;
    slug: string;
    description?: string;
    brandId?: string
    price: number;
    productSubCategoryId?: number;
    sku?: string;
    barcode?: string;
    weight?: number;
    dimensions?: string;
}

export interface IProductImage {
    id: string
    productId: string;
    imageUrl: string;
    cldPublicId?: string;
    isMainImage: boolean;
}