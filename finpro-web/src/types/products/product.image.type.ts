export interface IProductImage {
    id: string
    productId: string
    imageUrl: string
    cldPublicId?: string
    isMainImage: boolean
    createdAt: Date
    updatedAt: Date
    deletedAt?: Date
}