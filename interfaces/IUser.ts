import { Document } from "mongoose";

interface IUser extends Document {
  name: string;
  username: string;
  mobile: string;
  alternateMobile?: string;
  password: string;
  staffRole: string;
  shift: string;
  email?: string;
  address?: string;
  aadhar?: string;
  permissions: Array<{ permissionType: string; permissionArray: string[] }>;
  department?: string;
  checkIn?: string; //timestamp
  checkOut?: string; //timestamp
  isActive?: boolean;
  createdAt?: string;
  updateAt?: string;
}

export { IUser };
