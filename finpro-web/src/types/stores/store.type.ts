export interface IStore {
    id: string
    name: string
    address: string
    subDistrict: string
    district: string
    city: string
    province: string
    postalCode: string
    latitude: string
    longitude: string
    phoneNumber?: string
    email?: string
    createdAt: Date
    updatedAt: Date
    deletedAt?: Date
}

export interface IStoreTable extends IStore {
    [key: string]: unknown
}