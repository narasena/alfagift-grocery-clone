export interface IProductCategory {
    id: number
    name: string
    slug: string
    description?: string
    createdAt: Date
    updatedAt: Date
    deletedAt?: Date
}

export interface IProductSubCategory {
    id: number
    name: string
    slug: string
    description?: string
    productCategoryId: number
    createdAt: Date
    updatedAt: Date
    deletedAt?: Date
}