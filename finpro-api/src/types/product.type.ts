export interface IProduct {
    id: number;
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