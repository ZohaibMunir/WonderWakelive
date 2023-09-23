export interface User {
  _id: string;
  email: string;
  password: string;
  platform: string;
  userName?: string | undefined;
  displayName?: string | undefined;
  gender?: string | undefined;
  FcmToken?: string | undefined;
  active?: boolean | undefined;
  otp?: string | undefined;
  isDeleted?: boolean | undefined;
  createdAt?: Date;
  updatedAt?: Date;
}
