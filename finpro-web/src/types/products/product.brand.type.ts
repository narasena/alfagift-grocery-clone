export interface IProductBrand {
    id: string;
    name: string;
    slug: string;
    description?: string;
    logoUrl?: string
    cldPublicId?: string
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}