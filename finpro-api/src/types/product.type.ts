export interface IProduct {
    id: number;
    name: string;
    slug: string;
    description?: string;
    brandId?: string
    price: number;
    sku?: string;
    barcode?: string;
    weight?: number;
    dimensions?: string;
}