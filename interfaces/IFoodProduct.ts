import { Document } from "mongoose";

export interface IFoodProduct extends Document {
  name: string;
  image?: string;
  code: string;
  isVeg: boolean;
  category: string; //kitchen allocates
  subCategory: string;
  price: { price: number; department: string }[];
  // department: string;
  isReadyToServe?: boolean;
  tag?: string; //bestseller
  isAvailable?: boolean;
  expiryDate?: string;
}
