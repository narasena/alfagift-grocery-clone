export interface IProductCategory {
    id: number
    name: string
    slug: string
    description: string
}

export interface IProductSubCategory extends IProductCategory{
    productCategoryId: number
}