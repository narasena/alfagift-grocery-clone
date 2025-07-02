export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  gender: string;
  dateOfBirth: string;
  isEmailVerified: boolean;
  referralCode: string;
  createdAt: string;
  updatedAt: string;
}

export interface IUserTable extends IUser {
  [key:string]: unknown;
}

