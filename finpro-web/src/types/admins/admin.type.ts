export interface IAdmin {
  id: string;
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
  phoneNumber: string;
  role: EAdminRole;
  avatarImgUrl?: string;
  cldPublicId?: string;
  storeId?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

enum EAdminRole {
  SuperAdmin = "SuperAdmin",
  Admin = "Admin",
}

export interface IAdminTable extends IAdmin {
  [key: string]: unknown;
}
