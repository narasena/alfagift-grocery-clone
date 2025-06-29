export interface IAdmin {
  id: String;
  firstName: String;
  lastName?: String;
  email: String;
  password: String;
  phoneNumber: String;
  role: EAdminRole;
  avatarImgUrl?: String;
  cldPublicId?: String;
  storeId?: String;
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
