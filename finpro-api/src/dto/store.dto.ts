// src/dto/store.dto.ts
export interface CreateStoreDto {
  name: string;
  address: string;
  subDistrict: string;
  district: string;
  city: string;
  province: string;
  postalCode: string;
  latitude: string;
  longitude: string;
  phoneNumber?: string;
  email?: string;
}

export interface AssignAdminDto {
  adminId: string;
  storeId: string;
}