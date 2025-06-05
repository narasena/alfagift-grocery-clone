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

export interface ICloudinaryResult {
  public_id: string;
  secure_url: string;
  isMainImage: boolean;
}